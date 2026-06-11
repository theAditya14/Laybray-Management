import express from 'express';
import { fetchPaymentHistory } from '../controllers/paymentController.js';

const router = express.Router();
router.get('/', fetchPaymentHistory);
export default router;
