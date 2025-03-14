module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { txid } = req.body;

        // Perform server-side completion logic here
        console.log(`Completing payment with TXID: ${txid}`);

        // Simulate a successful completion
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
