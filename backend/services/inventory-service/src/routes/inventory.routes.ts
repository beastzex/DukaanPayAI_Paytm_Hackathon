import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

export const createInventoryRouter = (): Router => {
  const router = Router();
  const controller = new InventoryController();

  router.post('/skus', controller.createSKU);
  router.post('/update-stock', controller.updateStock);
  router.get('/status', controller.getStatus);
  router.get('/alerts/low-stock', controller.getLowStockAlerts);

  return router;
};
