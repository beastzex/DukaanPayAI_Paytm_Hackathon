import { createApp } from '../app';
import { UserService } from '../services/user.service';
import { IntegrationService } from '../services/integration.service';
import { UserRole } from '../domain/entities/entities';
import { CacheAside } from '../infrastructure/redis/cache-aside';
import { DistributedLock } from '../infrastructure/redis/distributed-lock';
import { QueueManager } from '../workers/queue-manager';
import { WebhookEngine } from '../integrations/webhooks/webhook-engine';
import { PostgresClient } from '../infrastructure/database/postgres-client';
import { RedisClient } from '../infrastructure/redis/redis-client';
import { KafkaEventBus } from '../events/kafka-client';
import { config } from '../configs/env.config';
import twilio from 'twilio';
import http from 'http';
import crypto from 'crypto';

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, passed: true, durationMs });
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({ name, passed: false, durationMs, error: err.message || String(err) });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name} (${durationMs}ms)`);
    console.error(`    \x1b[33mError: ${err.message || String(err)}\x1b[0m`);
    if (err.stack) {
      console.error(`    ${err.stack.split('\n').slice(1, 4).join('\n    ')}`);
    }
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('  DUKAANPAY AI - ENTERPRISE BACKEND ARCHITECTURE TEST SUITE');
  console.log('===============================================================\n');

  // Initialize infrastructure clients in memory / local mode
  PostgresClient.initialize();
  RedisClient.initialize();
  await KafkaEventBus.initialize();

  const app = createApp();
  let server: http.Server;
  let baseUrl = '';

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address() as any;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      console.log(`Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: User Registration with Argon2 Hashing & Role Assignment
    // -------------------------------------------------------------
    let registeredUser: any = null;
    const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
    const testPassword = 'Password@12345';

    await test('1. Auth: User registration uses Argon2 password hashing', async () => {
      const userService = new UserService();
      const testEmail = `merchant_${Date.now()}@kirana.test`;

      const result = await userService.register(
        testPhone,
        testPassword,
        testEmail,
        [UserRole.MERCHANT]
      );

      registeredUser = result.user;
      assert(registeredUser.id !== undefined, 'User must have a generated UUID');
      assert(registeredUser.email === testEmail, 'Email must match');
      assert(registeredUser.roles.includes(UserRole.MERCHANT), 'Role must be MERCHANT');
      assert(registeredUser.version === 1, 'Initial optimistic locking version must be 1');
    });

    // -------------------------------------------------------------
    // TEST 2: User Login & JWT Access/Refresh Token Rotation
    // -------------------------------------------------------------
    let authTokens: any = null;
    await test('2. Auth: User login validates Argon2 & issues JWT token pair', async () => {
      const userService = new UserService();
      const loginResult = await userService.login(testPhone, testPassword);

      authTokens = loginResult.tokens;
      assert(authTokens.accessToken !== undefined, 'Access token must be present');
      assert(authTokens.refreshToken !== undefined, 'Refresh token must be present');

      // Test token rotation via refreshTokens
      const refreshed = await userService.refreshTokens(authTokens.refreshToken);
      assert(refreshed.accessToken !== undefined, 'New access token must be issued on rotation');
      assert(refreshed.refreshToken !== undefined, 'New refresh token must be issued on rotation');
    });

    // -------------------------------------------------------------
    // TEST 3: Redis JWT Blacklist on Logout
    // -------------------------------------------------------------
    await test('3. Security: Redis token blacklist rejects revoked tokens', async () => {
      const userService = new UserService();
      const isBlacklistedBefore = await userService.isTokenRevoked(authTokens.accessToken);
      assert(!isBlacklistedBefore, 'Active token must not be blacklisted');

      await userService.logout(authTokens.accessToken);

      const isBlacklistedAfter = await userService.isTokenRevoked(authTokens.accessToken);
      assert(isBlacklistedAfter, 'Revoked token must be blacklisted in Redis');

      // Test hitting authenticated endpoint with blacklisted token
      const res = await fetch(`${baseUrl}/api/v1/merchants/${registeredUser.id}/profile`, {
        headers: { Authorization: `Bearer ${authTokens.accessToken}` },
      });
      assert(res.status === 401, `Request with blacklisted token must return 401 Unauthorized, got ${res.status}`);
    });

    // -------------------------------------------------------------
    // TEST 4: Idempotency-Key Guard Middleware Deduplication
    // -------------------------------------------------------------
    await test('4. Middleware: Idempotency-Key prevents duplicate processing & returns cached response', async () => {
      const idempotencyKey = `idem-${crypto.randomUUID()}`;
      const payload = {
        businessName: 'Sharma General Stores',
        ownerName: 'Ramesh Sharma',
        phoneNumber: '+9198' + Math.floor(10000000 + Math.random() * 90000000),
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
      };

      // First request with idempotency key
      const res1 = await fetch(`${baseUrl}/api/v1/merchants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      assert(res1.status === 201, `First request should succeed with 201 Created, got ${res1.status}`);
      const data1 = (await res1.json()) as any;

      // Second identical request with SAME idempotency key within TTL returns cached response
      const res2 = await fetch(`${baseUrl}/api/v1/merchants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      assert(res2.status === 201, `Second request with same key must return cached 201 Created, got ${res2.status}`);
      assert(res2.headers.get('x-cache-lookup') === 'IDEMPOTENT_HIT', 'Header must indicate IDEMPOTENT_HIT');
      const data2 = (await res2.json()) as any;
      assert(data1.data.id === data2.data.id, 'Cached merchant ID must match original exactly');
    });

    // -------------------------------------------------------------
    // TEST 5: Redis Cache-Aside Hit and Miss Pattern
    // -------------------------------------------------------------
    await test('5. Caching: Redis Cache-Aside handles cache miss, population, and hit', async () => {
      const testKey = `merchant:profile:${crypto.randomUUID()}`;
      let dbHits = 0;

      const fetchFromDb = async () => {
        dbHits++;
        return { id: 'm-123', name: 'Gupta Kirana', balance: 50000 };
      };

      // 1st call: Cache Miss -> Fetches from DB
      const result1 = await CacheAside.getOrSet<{ id: string; name: string; balance: number }>(
        testKey,
        fetchFromDb,
        60
      );
      assert(result1.name === 'Gupta Kirana', 'Result must match DB return');
      assert(dbHits === 1, 'Database must be hit on cache miss');

      // 2nd call: Cache Hit -> Fetches directly from Redis
      const result2 = await CacheAside.getOrSet<{ id: string; name: string; balance: number }>(
        testKey,
        fetchFromDb,
        60
      );
      assert(result2.name === 'Gupta Kirana', 'Cached result must match');
      assert(dbHits === 1, 'Database must NOT be hit on cache hit');
    });

    // -------------------------------------------------------------
    // TEST 6: Redlock Distributed Mutex Locking
    // -------------------------------------------------------------
    await test('6. Distributed Systems: Redlock acquires, prevents concurrency, and unlocks', async () => {
      const lockKey = `campaign:execution:${crypto.randomUUID()}`;
      const lock1 = await DistributedLock.acquireLock(lockKey, 5);
      assert(lock1 !== null, 'First lock acquisition must succeed');

      // Attempt concurrent lock acquisition on same key
      const lock2 = await DistributedLock.acquireLock(lockKey, 5);
      assert(lock2 === null, 'Concurrent acquisition on locked key must return null');

      // Release lock
      const released = await DistributedLock.releaseLock(lockKey, lock1!);
      assert(released, 'Lock must be successfully released');

      // Now acquisition must succeed again
      const lock3 = await DistributedLock.acquireLock(lockKey, 5);
      assert(lock3 !== null, 'Re-acquiring released lock must succeed');
      await DistributedLock.releaseLock(lockKey, lock3!);
    });

    // -------------------------------------------------------------
    // TEST 7: BullMQ Queues and Job Dispatch
    // -------------------------------------------------------------
    await test('7. Messaging: BullMQ initializes 6 queues and enqueues jobs with backoff', async () => {
      const whatsappQueue = QueueManager.getQueue('whatsapp_queue');
      assert(whatsappQueue !== null, 'whatsapp_queue must be initialized');

      const jobId = await QueueManager.enqueue('whatsapp_queue', 'send_merchant_alert', {
        to: '+919876543210',
        templateName: 'daily_ledger_summary',
        parameters: { totalSales: 15400, transactions: 42 },
      });

      assert(jobId !== undefined && jobId.length > 0, 'Job ID must be returned from queue');
    });

    // -------------------------------------------------------------
    // TEST 8: Twilio Webhook HMAC-SHA1 Signature Validation
    // -------------------------------------------------------------
    await test('8. Telecom: Twilio HMAC signature verification validates authentic requests & rejects forgery', async () => {
      const webhookUrl = 'https://api.dukaanpay.in/api/v1/communication/webhooks/twilio/whatsapp';
      const webhookParams: Record<string, string> = {
        From: 'whatsapp:+919876543210',
        To: 'whatsapp:+14155238886',
        Body: 'Haan stock book kar do',
        MessageSid: 'SM1234567890abcdef',
      };

      // Valid signature calculation using Twilio SDK
      const validSignature = twilio.getExpectedTwilioSignature(
        config.TWILIO_AUTH_TOKEN,
        webhookUrl,
        webhookParams
      );

      const isValid = twilio.validateRequest(
        config.TWILIO_AUTH_TOKEN,
        validSignature,
        webhookUrl,
        webhookParams
      );
      assert(isValid, 'Authentic Twilio HMAC signature must be validated as true');

      const isForgedValid = twilio.validateRequest(
        config.TWILIO_AUTH_TOKEN,
        'forged_invalid_signature_string',
        webhookUrl,
        webhookParams
      );
      assert(!isForgedValid, 'Tampered/forged signature must be rejected as false');
    });

    // -------------------------------------------------------------
    // TEST 9: AI Integration Connector (Clean Interface for AI Team)
    // -------------------------------------------------------------
    await test('9. AI Integration: Clean connector exposes context and ingests recommendations', async () => {
      const integrationService = new IntegrationService();
      const merchantId = crypto.randomUUID();

      // Fetch merchant context for AI model inference
      const context = await integrationService.getMerchantAIContext(merchantId);
      assert(context.merchantId === merchantId, 'Context must map to requested merchant');
      assert(context.rolling7dRevenueINR !== undefined, 'Revenue metrics must be present');
      assert(context.avgDailyTransactions !== undefined, 'Transaction frequency must be present');
      assert(context.externalSignals !== undefined, 'External signals must be present');

      // External AI Team posts a model-generated recommendation
      const aiRecommendation = {
        merchantId,
        actionType: 'STOCK_RESTOCK' as const,
        priority: 'HIGH' as const,
        title: 'Restock Tata Salt 1kg before Diwali spike',
        rationaleIndic: 'दिवाली से पहले नमक की बिक्री 3x बढ़ने की संभावना है।',
        projectedRevenueINR: 4200,
        payload: { sku: 'SALT-TATA-1KG', suggestedQty: 50, distributorId: 'dist-01' },
        requiresMerchantApproval: true,
      };

      const result = await integrationService.ingestAIAction(aiRecommendation);
      assert(result.actionId !== undefined, 'Action ID must be returned');
      assert(result.status === 'INGESTED', 'Initial status must be INGESTED');
      assert(result.queuedForApproval === true, 'Approval requirement flag must match');
    });

    // -------------------------------------------------------------
    // TEST 10: Webhook Engine HMAC-SHA256 Signing & Dispatch
    // -------------------------------------------------------------
    await test('10. Webhooks: Engine registers subscriptions and signs payloads with HMAC-SHA256', async () => {
      const secret = 'webhook_secret_key_abcdef12345';
      const testPayload = {
        event: 'transaction.completed',
        amount: 850,
        merchantId: 'm-987',
      };

      const signature = (WebhookEngine as any).signPayload(testPayload, secret);
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(testPayload))
        .digest('hex');

      assert(signature === expectedSignature, 'Webhook HMAC-SHA256 signature must be cryptographically sound');
    });

    // -------------------------------------------------------------
    // TEST 11: Health Probes & Prometheus Metrics Endpoints
    // -------------------------------------------------------------
    await test('11. Observability: Liveness, Readiness, and Prometheus /metrics endpoints', async () => {
      // 1. Liveness Probe
      const liveRes = await fetch(`${baseUrl}/health/live`);
      assert(liveRes.status === 200, `Liveness probe should return 200, got ${liveRes.status}`);
      const liveData = (await liveRes.json()) as any;
      assert(liveData.status === 'UP', 'Liveness status must be UP');

      // 2. Readiness Probe
      const readyRes = await fetch(`${baseUrl}/health/ready`);
      assert(readyRes.status === 200, `Readiness probe should return 200, got ${readyRes.status}`);
      const readyData = (await readyRes.json()) as any;
      assert(readyData.status === 'UP', 'Readiness status must be UP');

      // 3. Prometheus Metrics Endpoint
      const metricsRes = await fetch(`${baseUrl}/metrics`);
      assert(metricsRes.status === 200, `Metrics endpoint should return 200, got ${metricsRes.status}`);
      const metricsText = await metricsRes.text();
      assert(metricsText.includes('dukaanpay_http_requests_total'), 'Metrics must export http request counter');
      assert(metricsText.includes('dukaanpay_cache_hits_total'), 'Metrics must export cache hit counter');
      assert(metricsText.includes('dukaanpay_cache_misses_total'), 'Metrics must export cache miss counter');
    });

  } finally {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    await QueueManager.close();
    await KafkaEventBus.disconnect();
    await PostgresClient.close();
  }

  // Summary Report
  console.log('\n---------------------------------------------------------------');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('---------------------------------------------------------------\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
