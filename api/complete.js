module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'POST') {
        const { txid } = req.body;

        // Call Pi Server's /complete endpoint
        const piResponse = await fetch('https://api.minepi.com/v2/payments/{txid}/complete', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.PI_API_KEY}`, // Use your API key
                'Content-Type': 'application/json'
            }
        });

        if (piResponse.ok) {
            console.log(`Payment ${txid} completed successfully.`);
            res.status(200).json({ success: true });
        } else {
            console.error(`Failed to complete payment ${txid}.`);
            res.status(500).json({ error: 'Failed to complete payment' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
