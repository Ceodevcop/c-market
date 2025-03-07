document.getElementById("connectWallet").addEventListener("click", async () => {
    try {
        // Authenticate with Pi
        const auth = await Pi.authenticate(["username", "payments"]);
        console.log("User Authenticated:", auth);

        // Initiate 1 Pi payment for wallet connection
        const payment = await Pi.createPayment({
            amount: 1,
            memo: "C-Tok Wallet Connection Fee",
            metadata: { action: "connect_wallet" },
        });

        console.log("Payment Initiated:", payment);

        // Redirect to dashboard after successful payment
        payment.onSuccessfulPayment(async () => {
            console.log("Payment successful!");

            // Store in Supabase without a server (using REST API)
            await fetch("https://YOUR_SUPABASE_URL/rest/v1/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": "YOUR_SUPABASE_ANON_KEY",
                    "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"
                },
                body: JSON.stringify({
                    username: auth.user.username,
                    payment_id: payment.identifier,
                    status: "completed",
                })
            });

            window.location.href = "dashboard.html"; // Redirect after payment
        });

    } catch (error) {
        console.error("Error:", error);
    }
});
