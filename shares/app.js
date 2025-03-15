document.addEventListener('DOMContentLoaded', () => {
    const initBtn = document.getElementById('initBtn');
    const sellUnitBtn = document.getElementById('sellUnitBtn');
    const sellPieceBtn = document.getElementById('sellPieceBtn');
    const distributeRoiBtn = document.getElementById('distributeRoiBtn');
    const messageDiv = document.getElementById('message');

    initBtn.addEventListener('click', async () => {
        const response = await fetch('/api/init', { method: 'POST' });
        const data = await response.json();
        messageDiv.textContent = data.message;
    });

    sellUnitBtn.addEventListener('click', async () => {
        const unitId = document.getElementById('unitId').value;
        const investorId = document.getElementById('investorId').value;
        const response = await fetch('/api/sellUnit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unitId, investorId })
        });
        const data = await response.json();
        messageDiv.textContent = data.message || data.error;
    });

    sellPieceBtn.addEventListener('click', async () => {
        const pieceId = document.getElementById('pieceId').value;
        const vendorId = document.getElementById('vendorId').value;
        const response = await fetch('/api/sellPiece', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pieceId, vendorId })
        });
        const data = await response.json();
        messageDiv.textContent = data.message || data.error;
    });

    distributeRoiBtn.addEventListener('click', async () => {
        const totalRoi = document.getElementById('totalRoi').value;
        const response = await fetch('/api/distributeRoi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalRoi })
        });
        const data = await response.json();
        messageDiv.textContent = data.message;
    });
});
