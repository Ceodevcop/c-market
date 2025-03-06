document.addEventListener("DOMContentLoaded", async () => {
    const connectBtn = document.getElementById("connectWallet");

    connectBtn.addEventListener("click", async () => {
        if (!window.Pi) {
            alert("Pi Network SDK not detected. Open this in the Pi Browser.");
            return;
        }

        try {
            // Authenticate the user with Pi Network
            const scopes = ["payments"];
            const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

            if (!authResult || !authResult.user) {
                alert("Authentication failed. Try again.");
                return;
            }

            console.log("User authenticated:", authResult.user.username);

            // Prepare payment data
            const paymentData = {
                amount: 1,
                memo: "Pi Wallet Connection Fee",
                metadata: { purpose: "wallet_connection" }
            };

            // Initiate Pi payment
            const payment = await Pi.createPayment(paymentData, {
                onReadyForServerApproval: (paymentId) => {
                    console.log("Payment pending approval:", paymentId);
                },
                onReadyForServerCompletion: (paymentId) => {
                    console.log("Payment ready for completion:", paymentId);
                },
                onCancel: (paymentId) => {
                    alert("Payment canceled.");
                },
                onError: (error) => {
                    console.error("Payment error:", error);
                    alert("Payment failed: " + error);
                }
            });

            // Wait for payment completion
            const paymentResult = await payment.complete();
            console.log("Payment Result:", paymentResult);

            if (paymentResult.status === "COMPLETED") {
                alert("Payment successful! Redirecting to dashboard...");
                window.location.href = "dashboard.html";
            } else {
                alert("Payment was not completed. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred: " + error.message);
        }
    });
});
