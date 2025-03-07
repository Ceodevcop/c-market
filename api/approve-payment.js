export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        // Call Pi Network API to approve payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/approve', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Key bc2j9fznbipgejwz9nbe8pjat88lbycgn8ayzmagtweurnln2kuhykjvdoq9v7on` // Use your API key
            },
            body: JSON.stringify({ paymentId }),
        });

        if (!piResponse.ok) {
            const errorData = await piResponse.text();
            return res.status(piResponse.status).json({ success: false, error: errorData });
        }

        const data = await piResponse.json();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Approval error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
