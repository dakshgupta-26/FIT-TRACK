import mongoose from "mongoose";

const healthMetricSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "weight",
        "heart_rate_resting",
        "heart_rate_active",
        "blood_pressure_systolic",
        "blood_pressure_diastolic",
        "sleep_hours",
        "sleep_deep",
        "sleep_light",
        "sleep_rem",
        "bmi",
        "body_fat",
      ],
      required: true,
    },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: Date, required: true },
    notes: String,
  },
  { timestamps: true }
);

const HealthMetric = mongoose.model("HealthMetric", healthMetricSchema);
export default HealthMetric;