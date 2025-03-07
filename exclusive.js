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

                const payment = await Pi.createPayment(paymentData, {
                    // Handle payment approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Send paymentId to your server for approval
                        fetch('/api/approve-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Approval response:", data);
                            if (data.success) {
                                alert("Payment approved! Waiting for completion...");
                            } else {
                                alert("Payment approval failed. Try again.");
                            }
                        })
                        .catch(error => {
                            console.error("Fetch error:", error);
                            alert("Payment approval failed: " + error.message);
                        });
                    },

                    // Handle payment completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Send paymentId to your server for completion
                        fetch('/api/complete-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
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
                            console.error("Fetch error:", error);
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

                console.log("Payment created:", payment);

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


/*
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
