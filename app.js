document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('payButton');
    const paymentStatus = document.getElementById('paymentStatus');

    // Initialize the Pi SDK
    const pi = new Pi();

    payButton.addEventListener('click', async () => {
        paymentStatus.textContent = 'Payment status: Creating payment...';

        // Step 1: Create Payment
        const paymentData = {
            amount: 3.14, // Example amount
            memo: 'Test Payment', // Example memo
            metadata: { productId: '123' } // Example metadata
        };

        const payment = await pi.createPayment(paymentData);

        // Step 2: Server-Side Approval
        payment.onReadyForServerApproval(async (paymentId) => {
            paymentStatus.textContent = 'Payment status: Awaiting server approval...';

            // Send paymentId to your serverless function for approval
            const approvalResponse = await fetch('/api/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentId })
            });

            if (approvalResponse.ok) {
                paymentStatus.textContent = 'Payment status: Server approved. Awaiting user confirmation...';
            } else {
                paymentStatus.textContent = 'Payment status: Server approval failed.';
            }
        });

        // Step 3: Server-Side Completion
        payment.onReadyForServerCompletion(async (txid) => {
            paymentStatus.textContent = 'Payment status: Awaiting server completion...';

            // Send txid to your serverless function for completion
            const completionResponse = await fetch('/api/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ txid })
            });

            if (completionResponse.ok) {
                paymentStatus.textContent = 'Payment status: Completed successfully!';
            } else {
                paymentStatus.textContent = 'Payment status: Server completion failed.';
            }
        });

        // Handle errors
        payment.onError((error) => {
            paymentStatus.textContent = `Payment status: Error - ${error.message}`;
        });
    });
});
