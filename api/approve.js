module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { paymentId } = req.body;

        // Perform server-side approval logic here
        console.log(`Approving payment with ID: ${paymentId}`);

        // Simulate a successful approval
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
