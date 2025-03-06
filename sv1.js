document.addEventListener("DOMContentLoaded", async () => {
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Initialize Pi SDK
        Pi.init({
            version: "2.0",
            sandbox: false, // Set to `true` for sandbox/testing environment
            apiKey: "GC7R5QICNKBDFRABMCJNHGS6OO2SQFPZTKFTOTP2ZKQQGIVUY55FHE7L"
        });

        console.log("Pi SDK initialized successfully.");

        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                // Authenticate the user
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                // Create a payment
                const paymentData = {
                    amount: 1, // Payment amount in Pi
                    memo: "Pi Wallet Connection Fee", // Payment memo
                    metadata: { purpose: "wallet_connection" } // Additional metadata
                };

                Pi.createPayment(paymentData, {
                    // Handle payment approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Send paymentId to your Python server for approval
                        fetch('http://localhost:3000/approve-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Approval response:", data);
                            if (data.success) {
                                alert("Payment approved! Waiting for completion...");
                            } else {
                                alert("Payment approval failed. Try again.");
                            }
                        })
                        .catch(error => {
                            console.error("Approval error:", error);
                            alert("Payment approval failed: " + error.message);
                        });
                    },

                    // Handle payment completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Send paymentId to your Python server for completion
                        fetch('http://localhost:3000/complete-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Completion response:", data);
                            if (data.success) {
                                alert("Payment completed successfully! Redirecting...");
                                window.location.href = "dashboard.html"; // Redirect after payment
                            } else {
                                alert("Payment completion failed. Try again.");
                            }
                        })
                        .catch(error => {
                            console.error("Completion error:", error);
                            alert("Payment completion failed: " + error.message);
                        });
                    },

                    // Handle payment cancellation
                    onCancel: (paymentId) => {
                        alert("Payment canceled.");
                    },

                    // Handle payment errors
                    onError: (error) => {
                        console.error("Payment error:", error);
                        alert("Payment failed: " + error.message);
                    }
                });

                alert("Payment initiated! Waiting for confirmation...");
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
