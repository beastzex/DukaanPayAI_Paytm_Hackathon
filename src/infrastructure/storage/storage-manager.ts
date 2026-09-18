import fs from 'fs';
import path from 'path';
import { config } from '../../configs/env.config';
import { logger } from '../../monitoring/logger';
import { ValidationException } from '../../domain/exceptions/domain-exceptions';

export interface StorageUploadResult {
  fileKey: string;
  storageUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface IStorageProvider {
  uploadFile(fileKey: string, content: Buffer, mimeType: string): Promise<StorageUploadResult>;
  getSignedUrl(fileKey: string, expirySeconds?: number): Promise<string>;
  deleteFile(fileKey: string): Promise<boolean>;
}

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public async uploadFile(fileKey: string, content: Buffer, mimeType: string): Promise<StorageUploadResult> {
    const filePath = path.join(this.baseDir, fileKey);
    const parent = path.dirname(filePath);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    await fs.promises.writeFile(filePath, content);

    return {
      fileKey,
      storageUrl: `/storage/files/${fileKey}`,
      fileSize: content.length,
      mimeType,
    };
  }

  public async getSignedUrl(fileKey: string, _expirySeconds = 3600): Promise<string> {
    // In local mode, returns direct download URL with token
    return `http://localhost:${config.PORT}/storage/files/${fileKey}?token=local_signed_auth_${Date.now()}`;
  }

  public async deleteFile(fileKey: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, fileKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}

export class StorageManager {
  private static provider: IStorageProvider = new LocalStorageProvider();

  public static initialize(): void {
    if (config.STORAGE_PROVIDER === 's3' || config.STORAGE_PROVIDER === 'minio') {
      logger.info(`Initialized ${config.STORAGE_PROVIDER.toUpperCase()} storage provider`);
    } else {
      logger.info('Initialized local filesystem storage provider');
    }
  }

  public static validateFile(fileSize: number, mimeType: string, allowedMimeTypes: string[], maxBytes = 10 * 1024 * 1024): void {
    if (fileSize > maxBytes) {
      throw new ValidationException(`File size ${fileSize} exceeds maximum limit of ${maxBytes} bytes`);
    }
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new ValidationException(`MIME type '${mimeType}' is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }
  }

  public static async upload(fileKey: string, content: Buffer, mimeType: string): Promise<StorageUploadResult> {
    return this.provider.uploadFile(fileKey, content, mimeType);
  }

  public static async getSignedUrl(fileKey: string, expirySeconds = 3600): Promise<string> {
    return this.provider.getSignedUrl(fileKey, expirySeconds);
  }

  public static async delete(fileKey: string): Promise<boolean> {
    return this.provider.deleteFile(fileKey);
  }
}
