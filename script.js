/*document.addEventListener("DOMContentLoaded", async () => {
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Initialize Pi SDK with your API Key
        Pi.init({ version: "2.0", sandbox: false, apiKey: "dmcfgx7myqzcsamt7mv4qxblszendpfzfvqiqfdmb5ymyotsthnfbeu20qactsng" });

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
});*/

document.addEventListener("DOMContentLoaded", async () => {
    // Step 1: Check for Pi SDK Availability
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Step 2: Initialize the Pi SDK
        Pi.init({
            version: "2.0",
            sandbox: false, // Set to `true` for sandbox/testing environment
            apiKey: "GC7R5QICNKBDFRABMCJNHGS6OO2SQFPZTKFTOTP2ZKQQGIVUY55FHE7L"
        });

        console.log("Pi SDK initialized successfully.");

        // Step 3: Set Up the Wallet Connection Button
        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                // Step 4: Authenticate the User
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                // Step 5: Create a Payment
                const paymentData = {
                    amount: 1, // Payment amount in Pi
                    memo: "Pi Wallet Connection Fee", // Payment memo
                    metadata: { purpose: "wallet_connection" } // Additional metadata
                };

                // Step 6: Create Payment and Handle Callbacks
                Pi.createPayment(paymentData, {
                    // Step 7: Handle Payment Approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Send paymentId to your server for approval
                        fetch('/approve-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        }).then(response => response.json())
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

                    // Step 8: Handle Payment Completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Send paymentId to your server for completion
                        fetch('/complete-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        }).then(response => response.json())
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

                    // Step 9: Handle Payment Cancellation
                    onCancel: (paymentId) => {
                        alert("Payment canceled.");
                    },

                    // Step 10: Handle Payment Errors
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
        // Step 11: Handle SDK Initialization Errors
        console.error("Pi SDK Initialization Error:", error);
        alert("Failed to initialize Pi SDK: " + error.message);
    }
});

