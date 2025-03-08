export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { payment_id, username } = req.body;

    try {
        // Verify payment with Pi Network API
        const paymentStatus = await fetch(`https://api.minepi.com/v2/payments/${payment_id}`, {
            headers: { "Authorization": `Key YOUR_PI_API_KEY` },
        }).then(res => res.json());

        if (!paymentStatus || paymentStatus.status !== "completed") {
            return res.status(400).json({ error: "Payment verification failed" });
        }

        // Store payment data in a JSON file (or Vercel KV if needed)
        const fs = require("fs");
        const data = { username, payment_id, status: "confirmed", timestamp: new Date() };
        
        fs.appendFileSync("payments.json", JSON.stringify(data) + "\n");

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
