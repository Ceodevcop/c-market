module.exports = async (req, res) => {
    const { unitId, investorId } = req.body;

    if (!unitId || !investorId) {
        return res.status(400).json({ error: "Unit ID and Investor ID are required" });
    }

    // Simulate selling a unit
    res.status(200).json({ message: `Unit ${unitId} sold to ${investorId}` });
};
