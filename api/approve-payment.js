export default async function handler(req, res) {
    console.log("Request received:", req.method, req.body); // Log the request

    // Step 1: Check the request method
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Step 2: Validate the request body
    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        console.log("Calling Pi Network API to approve payment:", paymentId); // Log the paymentId

        // Step 3: Call Pi Network API to approve payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/approve', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Key bc2j9fznbipgejwz9nbe8pjat88lbycgn8ayzmagtweurnln2kuhykjvdoq9v7on` // Use your API key
            },
            body: JSON.stringify({ paymentId }),
        });

        // Step 4: Handle Pi Network API response
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
export default async function handler(req, res) {
    console.log("Request received:", req.method, req.body); // Log the request

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId is required' });
    }

    try {
        console.log("Calling Pi Network API to approve payment:", paymentId); // Log the paymentId

        // Call Pi Network API to approve payment
        const piResponse = await fetch('https://api.minepi.com/v2/payments/approve', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Key bc2j9fznbipgejwz9nbe8pjat88lbycgn8ayzmagtweurnln2kuhykjvdoq9v7on` // Use your API key
            },
            body: JSON.stringify({ paymentId }),
        });

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
