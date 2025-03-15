module.exports = async (req, res) => {
    const { totalRoi } = req.body;

    if (!totalRoi) {
        return res.status(400).json({ error: "Total ROI is required" });
    }

    // Simulate ROI distribution
    res.status(200).json({ message: `ROI of ${totalRoi} distributed successfully` });
};
