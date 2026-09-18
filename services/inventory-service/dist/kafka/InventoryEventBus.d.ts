import { InventoryAlertPayload } from '@dukaanpay/shared-types';
export declare class InventoryEventBus {
    private eventBus;
    private repo;
    constructor();
    publishInventoryAlert(payload: InventoryAlertPayload, correlationId?: string): Promise<void>;
    startConsumers(): Promise<void>;
}
//# sourceMappingURL=InventoryEventBus.d.ts.map