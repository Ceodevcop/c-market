document.getElementById("connectWallet").addEventListener("click", async () => {
    try {
        const scopes = ["payments"];
        const authResult = await Pi.authenticate(scopes, (data) => console.log(data));

        console.log("Auth result:", authResult);
        document.getElementById("payPi").disabled = false;
    } catch (error) {
        console.error("Authentication error:", error);
        alert("Failed to connect wallet.");
    }
});

document.getElementById("payPi").addEventListener("click", async () => {
    try {
        const payment = await Pi.createPayment({
            amount: 1,
            memo: "C-Tok Wallet Connection",
            metadata: { type: "wallet_connection" }
        });

        console.log("Payment created:", payment);
        document.getElementById("status").innerText = "Processing Payment...";

        // Send transaction to backend
        fetch("/api/verify_payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txid: payment.txid })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("status").innerText = data.message;
        })
        .catch(err => console.error("Payment error:", err));
    } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment error: " + error.message);
    }
});
