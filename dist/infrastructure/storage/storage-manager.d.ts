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
export declare class LocalStorageProvider implements IStorageProvider {
    private baseDir;
    constructor();
    uploadFile(fileKey: string, content: Buffer, mimeType: string): Promise<StorageUploadResult>;
    getSignedUrl(fileKey: string, _expirySeconds?: number): Promise<string>;
    deleteFile(fileKey: string): Promise<boolean>;
}
export declare class StorageManager {
    private static provider;
    static initialize(): void;
    static validateFile(fileSize: number, mimeType: string, allowedMimeTypes: string[], maxBytes?: number): void;
    static upload(fileKey: string, content: Buffer, mimeType: string): Promise<StorageUploadResult>;
    static getSignedUrl(fileKey: string, expirySeconds?: number): Promise<string>;
    static delete(fileKey: string): Promise<boolean>;
}
//# sourceMappingURL=storage-manager.d.ts.map