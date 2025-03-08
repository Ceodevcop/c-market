export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { txid } = req.body;

    if (!txid) {
        return res.status(400).json({ error: "Transaction ID required" });
    }

    try {
        // Fake verification for now
        const isVerified = txid.startsWith("pi_"); // Simulating a valid Pi transaction

        if (isVerified) {
            return res.status(200).json({ success: true, message: "Payment verified!" });
        } else {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
