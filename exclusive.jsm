
fetch('/api/approve-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the response as JSON
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


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        // Call Pi Network API to complete payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }),
        });

        if (!piResponse.ok) {
            const errorData = await piResponse.text();
            return res.status(piResponse.status).json({ success: false, error: errorData });
        }

        const data = await piResponse.json();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Completion error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
async function approvePayment(paymentId) {
  try {
    const response = await fetch("/api/approve-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Payment approved successfully!");
      console.log("Payment Details:", data);
    } else {
      alert("Error: " + data.error);
      console.error("Payment Approval Failed:", data);
    }
  } catch (error) {
    alert("Something went wrong. Check the console for details.");
    console.error("Network Error:", error);
  }
}
