document.addEventListener("DOMContentLoaded", async () => {
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Initialize Pi SDK with your App ID
        Pi.init({ version: "2.0", sandbox: true }); // Set sandbox to false for Mainnet

        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                const paymentData = {
                    amount: 1,
                    memo: "Pi Wallet Connection Fee",
                    metadata: { purpose: "wallet_connection" }
                };

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
    } catch (error) {
        console.error("Pi SDK Initialization Error:", error);
        alert("Failed to initialize Pi SDK: " + error.message);
    }
});
