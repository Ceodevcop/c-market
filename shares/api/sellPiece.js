module.exports = async (req, res) => {
    const { pieceId, vendorId } = req.body;

    if (!pieceId || !vendorId) {
        return res.status(400).json({ error: "Piece ID and Vendor ID are required" });
    }

    // Simulate selling a piece
    res.status(200).json({ message: `Piece ${pieceId} sold to ${vendorId}` });
};
