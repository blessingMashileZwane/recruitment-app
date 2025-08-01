import { Router } from 'express';
import { someController } from '../controllers';

const router = Router();

router.get('/some-route', someController.someMethod);

export default router;