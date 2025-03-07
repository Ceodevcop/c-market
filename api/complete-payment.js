export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        // Call Pi Network API to complete payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/complete', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Key dmcfgx7myqzcsamt7mv4qxblszendpfzfvqiqfdmb5ymyotsthnfbeu20qactsng` // Use your API key
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
        console.error('Completion error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
