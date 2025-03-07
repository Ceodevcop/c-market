document.getElementById("connectWallet").addEventListener("click", async () => {
    try {
        // Authenticate user with Pi
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
        payment.onReadyForServerApproval(() => {
            console.log("Payment approved by user, sending to server...");
        });

        payment.onSuccessfulPayment(() => {
            console.log("Payment successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard
        });

    } catch (error) {
        console.error("Error:", error);
    }
});
