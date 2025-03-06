document.addEventListener("DOMContentLoaded", async () => {
    const connectBtn = document.getElementById("connectWallet");
    
    connectBtn.addEventListener("click", async () => {
        if (!window.Pi) {
            alert("Pi Network SDK not detected. Please open in Pi Browser.");
            return;
        }

        try {
            // Initialize Pi authentication
            const scopes = ["payments"];
            const authResult = await Pi.authenticate(scopes, (res) => console.log(res));
            
            if (!authResult || !authResult.user) {
                alert("Wallet connection failed.");
                return;
            }

            const paymentData = {
                amount: 1,
                memo: "Wallet connection fee",
                metadata: { type: "wallet_connection" }
            };

            // Create a payment request
            const payment = await Pi.createPayment(paymentData, {
                onReadyForServerApproval: (paymentId) => {
                    console.log("Payment ready for server approval:", paymentId);
                },
                onReadyForServerCompletion: (paymentId) => {
                    console.log("Payment ready for server completion:", paymentId);
                },
                onCancel: (paymentId) => {
                    alert("Payment was canceled.");
                },
                onError: (error) => {
                    alert("Payment error: " + error);
                }
            });

            // Wait for payment to be completed
            const paymentResult = await payment.complete();
            if (paymentResult.status === "COMPLETED") {
                window.location.href = "dashboard.html";
            } else {
                alert("Payment failed. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    });
});
