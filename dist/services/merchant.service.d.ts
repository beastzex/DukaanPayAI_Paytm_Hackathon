import { MerchantEntity } from '../domain/entities/entities';
export declare class MerchantService {
    private merchantRepo;
    getProfile(id: string): Promise<MerchantEntity>;
    register(data: Omit<MerchantEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<MerchantEntity>;
    updateSettings(id: string, settings: Record<string, any>, expectedVersion: number): Promise<MerchantEntity>;
}
//# sourceMappingURL=merchant.service.d.ts.map