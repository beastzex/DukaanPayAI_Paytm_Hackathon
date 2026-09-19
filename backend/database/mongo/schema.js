/**
 * DukaanPayAI – MongoDB Collections & Compound Index Schema
 * Stores unstructured OCR tokens, handwritten diary entries, and agent trace trees.
 */

// 1. Raw Invoices Collection
db.createCollection("raw_invoices", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["merchant_id", "image_s3_url", "raw_ocr_tokens", "created_at"],
      properties: {
        merchant_id: { bsonType: "string" },
        distributor_name: { bsonType: "string" },
        image_s3_url: { bsonType: "string" },
        raw_ocr_tokens: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["text", "confidence"],
            properties: {
              text: { bsonType: "string" },
              box: { bsonType: "array" },
              confidence: { bsonType: "double" }
            }
          }
        },
        extracted_line_items: { bsonType: "array" },
        overcharge_detected: { bsonType: "double" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

db.raw_invoices.createIndex({ merchant_id: 1, created_at: -1 });
db.raw_invoices.createIndex({ distributor_name: 1 });

// 2. Handwritten Khaata Diary Entries Collection
db.createCollection("khaata_diary_entries", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["merchant_id", "raw_image_url", "handwritten_entries", "created_at"],
      properties: {
        merchant_id: { bsonType: "string" },
        raw_image_url: { bsonType: "string" },
        handwritten_entries: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["customer_name", "amount", "entry_type"],
            properties: {
              customer_name: { bsonType: "string" },
              amount: { bsonType: "double" },
              entry_type: { enum: ["UDHAAR_GIVEN", "JAMA_RECEIVED"] },
              matched_customer_phone: { bsonType: "string" }
            }
          }
        },
        created_at: { bsonType: "date" }
      }
    }
  }
});

db.khaata_diary_entries.createIndex({ merchant_id: 1 });

// 3. LangGraph Multi-Agent Execution Trace Collection
db.createCollection("agent_execution_traces", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["merchant_id", "execution_id", "agent_states", "timestamp"],
      properties: {
        merchant_id: { bsonType: "string" },
        execution_id: { bsonType: "string" },
        intent: { bsonType: "string" },
        agent_states: { bsonType: "array" },
        human_approval_state: { bsonType: "object" },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

db.agent_execution_traces.createIndex({ merchant_id: 1, timestamp: -1 });
db.agent_execution_traces.createIndex({ execution_id: 1 }, { unique: true });
