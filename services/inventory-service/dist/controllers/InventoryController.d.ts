import { Request, Response, NextFunction } from 'express';
export declare class InventoryController {
    private service;
    constructor();
    createSKU: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStock: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLowStockAlerts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=InventoryController.d.ts.map