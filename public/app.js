document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('payButton');
    const paymentStatus = document.getElementById('paymentStatus');

    const pi = new Pi();

    payButton.addEventListener('click', async () => {
        paymentStatus.textContent = 'Payment status: Creating payment...';

        const paymentData = {
            amount: 3.14,
            memo: 'Test Payment',
            metadata: { productId: '123' }
        };

        const payment = await pi.createPayment(paymentData);

        payment.onReadyForServerApproval(async (paymentId) => {
            paymentStatus.textContent = 'Payment status: Awaiting server approval...';

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

        payment.onReadyForServerCompletion(async (txid) => {
            paymentStatus.textContent = 'Payment status: Awaiting server completion...';

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

        payment.onError((error) => {
            paymentStatus.textContent = `Payment status: Error - ${error.message}`;
        });
    });
});
