document.addEventListener("DOMContentLoaded", async () => {
    // Step 1: Check if Pi SDK is available
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Step 2: Initialize Pi SDK for Testnet
        Pi.init({
            version: "2.0",
            sandbox: true, // Use Testnet
            apiKey: "YOUR_TESTNET_API_KEY" // Replace with your Testnet API key
        });

        console.log("Pi SDK initialized successfully.");

        // Step 3: Set up the payment button
        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                // Step 4: Authenticate the user
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                // Step 5: Create a payment
                const paymentData = {
                    amount: 1, // Payment amount in Test-Pi
                    memo: "Test Payment", // Payment memo
                    metadata: { purpose: "testing" } // Additional metadata
                };

                const payment = await Pi.createPayment(paymentData, {
                    // Step 6: Handle payment approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Simulate server-side approval (for testing only)
                        setTimeout(() => {
                            alert("Payment approved! Waiting for completion...");
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Step 7: Handle payment completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Simulate server-side completion (for testing only)
                        setTimeout(() => {
                            alert("Payment completed successfully! Redirecting...");
                            window.location.href = "dashboard.html"; // Redirect after payment
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Step 8: Handle payment cancellation
                    onCancel: (paymentId) => {
                        alert("Payment canceled.");
                    },

                    // Step 9: Handle payment errors
                    onError: (error) => {
                        console.error("Payment error:", error);
                        alert("Payment failed: " + error.message);
                    }
                });
/*
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

document.addEventListener("DOMContentLoaded", async () => {
    // Step 1: Check if Pi SDK is available
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Step 2: Initialize Pi SDK for Testnet
        Pi.init({
            version: "2.0",
            sandbox: true, // Use Testnet
            apiKey: "YOUR_TESTNET_API_KEY" // Replace with your Testnet API key
        });

        console.log("Pi SDK initialized successfully.");

        // Step 3: Set up the payment button
        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                // Step 4: Authenticate the user
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                // Step 5: Create a payment
                const paymentData = {
                    amount: 1, // Payment amount in Test-Pi
                    memo: "Test Payment", // Payment memo
                    metadata: { purpose: "testing" } // Additional metadata
                };

                const payment = await Pi.createPayment(paymentData, {
                    // Step 6: Handle payment approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Simulate server-side approval (for testing only)
                        setTimeout(() => {
                            alert("Payment approved! Waiting for completion...");
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Step 7: Handle payment completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Simulate server-side completion (for testing only)
                        setTimeout(() => {
                            alert("Payment completed successfully! Redirecting...");
                            window.location.href = "dashboard.html"; // Redirect after payment
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Step 8: Handle payment cancellation
                    onCancel: (paymentId) => {
                        alert("Payment canceled.");
                    },

                    // Step 9: Handle payment errors
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
