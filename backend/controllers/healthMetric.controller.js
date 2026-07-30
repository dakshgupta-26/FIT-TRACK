import HealthMetric from "../models/healthMetric.model.js";

export const createHealthMetric = async (req, res) => {
  try {
    const { uid, type, value, unit, date, notes } = req.body;
    if (!uid || !type || !value || !unit || !date)
      return res.status(400).json({ error: "Required fields are missing" });
    const healthMetric = new HealthMetric({
      uid,
      type,
      value,
      unit,
      date: new Date(date),
      notes: notes || "",
    });
    await healthMetric.save();
    res.json({ success: true, healthMetric });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHealthMetrics = async (req, res) => {
  try {
    const { uid } = req.params;
    const { type, limit = 100 } = req.query;
    let query = { uid };
    if (type) query.type = type;
    const metrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHealthMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, unit, date, notes } = req.body;
    const updateData = {
      value,
      unit,
      date: date ? new Date(date) : undefined,
      notes,
    };
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const healthMetric = await HealthMetric.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!healthMetric)
      return res.status(404).json({ error: "Health metric not found" });

    res.json({ success: true, healthMetric });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHealthMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const healthMetric = await HealthMetric.findByIdAndDelete(id);
    if (!healthMetric)
      return res.status(404).json({ error: "Health metric not found" });
    res.json({ success: true, message: "Health metric deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHealthMetricsSummary = async (req, res) => {
  try {
    const { uid } = req.params;
    const latestMetrics = await HealthMetric.aggregate([
      { $match: { uid } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$type",
          latestValue: { $first: "$value" },
          latestUnit: { $first: "$unit" },
          latestDate: { $first: "$date" },
        },
      },
    ]);
    res.json({ success: true, summary: latestMetrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};