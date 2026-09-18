"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = exports.LocalStorageProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_config_1 = require("../../configs/env.config");
const logger_1 = require("../../monitoring/logger");
const domain_exceptions_1 = require("../../domain/exceptions/domain-exceptions");
class LocalStorageProvider {
    baseDir;
    constructor() {
        this.baseDir = path_1.default.resolve(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(this.baseDir)) {
            fs_1.default.mkdirSync(this.baseDir, { recursive: true });
        }
    }
    async uploadFile(fileKey, content, mimeType) {
        const filePath = path_1.default.join(this.baseDir, fileKey);
        const parent = path_1.default.dirname(filePath);
        if (!fs_1.default.existsSync(parent)) {
            fs_1.default.mkdirSync(parent, { recursive: true });
        }
        await fs_1.default.promises.writeFile(filePath, content);
        return {
            fileKey,
            storageUrl: `/storage/files/${fileKey}`,
            fileSize: content.length,
            mimeType,
        };
    }
    async getSignedUrl(fileKey, _expirySeconds = 3600) {
        // In local mode, returns direct download URL with token
        return `http://localhost:${env_config_1.config.PORT}/storage/files/${fileKey}?token=local_signed_auth_${Date.now()}`;
    }
    async deleteFile(fileKey) {
        const filePath = path_1.default.join(this.baseDir, fileKey);
        if (fs_1.default.existsSync(filePath)) {
            await fs_1.default.promises.unlink(filePath);
            return true;
        }
        return false;
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
class StorageManager {
    static provider = new LocalStorageProvider();
    static initialize() {
        if (env_config_1.config.STORAGE_PROVIDER === 's3' || env_config_1.config.STORAGE_PROVIDER === 'minio') {
            logger_1.logger.info(`Initialized ${env_config_1.config.STORAGE_PROVIDER.toUpperCase()} storage provider`);
        }
        else {
            logger_1.logger.info('Initialized local filesystem storage provider');
        }
    }
    static validateFile(fileSize, mimeType, allowedMimeTypes, maxBytes = 10 * 1024 * 1024) {
        if (fileSize > maxBytes) {
            throw new domain_exceptions_1.ValidationException(`File size ${fileSize} exceeds maximum limit of ${maxBytes} bytes`);
        }
        if (!allowedMimeTypes.includes(mimeType)) {
            throw new domain_exceptions_1.ValidationException(`MIME type '${mimeType}' is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
        }
    }
    static async upload(fileKey, content, mimeType) {
        return this.provider.uploadFile(fileKey, content, mimeType);
    }
    static async getSignedUrl(fileKey, expirySeconds = 3600) {
        return this.provider.getSignedUrl(fileKey, expirySeconds);
    }
    static async delete(fileKey) {
        return this.provider.deleteFile(fileKey);
    }
}
exports.StorageManager = StorageManager;
//# sourceMappingURL=storage-manager.js.map