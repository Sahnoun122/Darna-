import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new PropertyController();

router.post('/', authenticate, controller.create.bind(controller));
router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
export default router;
