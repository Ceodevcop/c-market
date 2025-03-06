document.addEventListener("DOMContentLoaded", async () => {
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Initialize Pi SDK
        Pi.init({ version: "2.0", sandbox: false, apiKey: "GC7R5QICNKBDFRABMCJNHGS6OO2SQFPZTKFTOTP2ZKQQGIVUY55FHE7L" });

        console.log("Pi SDK initialized successfully.");

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

                Pi.createPayment(paymentData, {
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

                alert("Payment initiated! Waiting for confirmation...");

                // Simulating a wait before redirecting
                setTimeout(() => {
                    alert("Payment should be confirmed by now. Redirecting...");
                    window.location.href = "dashboard.html"; // Redirect after payment
                }, 10000); // Wait 10 seconds

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
