import { getPublicAccounts } from '../../src/config/emailAccounts';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const accounts = getPublicAccounts();
        res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error fetching email accounts:', error);
        res.status(500).json({ error: 'Failed to fetch email accounts' });
    }
}
