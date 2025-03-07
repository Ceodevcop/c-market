fetch('/api/approve-payment', {
    method: 'POST', // Ensure this is POST
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
export default async function handler(req, res) {
    console.log("Request received:", req.method, req.body); // Log the request

    // Step 2.1: Check the request method
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Step 2.2: Validate the request body
    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        console.log("Calling Pi Network API to approve payment:", paymentId); // Log the paymentId

        // Step 2.3: Call Pi Network API to approve payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/approve', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Key dmcfgx7myqzcsamt7mv4qxblszendpfzfvqiqfdmb5ymyotsthnfbeu20qactsng` // Use your API key
            },
            body: JSON.stringify({ paymentId }),
        });

        // Step 2.4: Handle Pi Network API response
        if (!piResponse.ok) {
            const errorData = await piResponse.text();
            console.error("Pi Network API error:", errorData); // Log the error
            return res.status(piResponse.status).json({ success: false, error: errorData });
        }

        const data = await piResponse.json();
        console.log("Pi Network API response:", data); // Log the response
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Approval error:', error); // Log the error
        res.status(500).json({ success: false, error: error.message });
    }
        }
