fetch('/api/approve-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId: "your-payment-id" }) // Include the paymentId
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
