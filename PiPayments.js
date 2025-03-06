// Initialize Pi SDK
const Pi = window.Pi;

// Check if Pi SDK is available
if (!Pi) {
    console.error("Pi SDK not found. Ensure this is running inside the Pi Browser.");
}

// Authenticate User
async function authenticateUser() {
    try {
        const scopes = ['payments', 'username'];
        const user = await Pi.authenticate(scopes);
        console.log("User authenticated:", user);
        return user;
    } catch (error) {
        console.error("Authentication failed:", error);
        return null;
    }
}

// Handle U2A Payment (User to App)
async function processU2APayment(amount, memo) {
    try {
        const payment = await Pi.createPayment({
            amount: amount, 
            memo: memo, 
            metadata: { type: "U2A Payment" }
        });

        console.log("Payment created:", payment);

        // Listen for payment status updates
        payment.onReadyForServerApproval(() => updateStatus("Waiting for approval..."));
        payment.onReadyForServerCompletion(() => updateStatus("Processing payment..."));
        payment.onCancelled(() => updateStatus("Payment cancelled."));
        payment.onError((error) => updateStatus(`Error: ${error.message}`));
        
        return payment;
    } catch (error) {
        console.error("U2A Payment error:", error);
    }
}

// Handle A2U Payment (App to User)
async function processA2UPayment(user, amount, memo) {
    try {
        const payment = await Pi.createA2UPayment({
            to: user.username, 
            amount: amount, 
            memo: memo, 
            metadata: { type: "A2U Payment" }
        });

        console.log("A2U Payment created:", payment);

        // Listen for payment status updates
        payment.onReadyForServerApproval(() => updateStatus("A2U: Waiting for approval..."));
        payment.onReadyForServerCompletion(() => updateStatus("A2U: Processing payment..."));
        payment.onCancelled(() => updateStatus("A2U: Payment cancelled."));
        payment.onError((error) => updateStatus(`A2U Error: ${error.message}`));

        return payment;
    } catch (error) {
        console.error("A2U Payment error:", error);
    }
}

// Update UI with payment status
function updateStatus(message) {
    const statusElement = document.getElementById("paymentStatus");
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(message);
}

// Run authentication on page load
window.onload = async () => {
    const user = await authenticateUser();
    if (user) {
        updateStatus(`Welcome, ${user.username}!`);
    }
};

// Example usage (you can trigger these via buttons)
document.getElementById("payButton").addEventListener("click", async () => {
    await processU2APayment(1, "Paying 1 Pi for service");
});

document.getElementById("withdrawButton").addEventListener("click", async () => {
    const user = await authenticateUser();
    if (user) {
        await processA2UPayment(user, 1, "Withdrawing 1 Pi");
    }
});
 
