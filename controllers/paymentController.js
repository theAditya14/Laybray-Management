import { getPaymentHistory } from '../libraryManager.js';

export async function fetchPaymentHistory(req, res) {
  try {
    const history = await getPaymentHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history', details: error.message });
  }
}
