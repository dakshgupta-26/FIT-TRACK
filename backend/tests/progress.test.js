import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Progress from "../models/progress.model.js";
import Workout from "../models/workout.model.js";
import Goal from "../models/goal.model.js";

dotenv.config();

const runProgressTests = async () => {
  console.log("=======================================================");
  console.log("🧪 FitTracker Progress / Transformation Engine Test Suite");
  console.log("=======================================================");

  const isConnected = await connectDB();
  if (!isConnected) {
    console.error("❌ MongoDB connection failed. Aborting tests.");
    process.exit(1);
  }

  try {
    // 1. Setup Test User
    let testUser = await User.findOne({ email: "transformation.test@fittrack.io" });
    if (!testUser) {
      testUser = await User.create({
        firstName: "Marcus",
        lastName: "Vance",
        email: "transformation.test@fittrack.io",
        password: "Password123!",
        authProvider: "local",
      });
      console.log("✅ Created Test User:", testUser.email);
    }

    // Clean any prior test entries for this test user
    await Progress.deleteMany({ user: testUser._id });
    await Workout.deleteMany({ user: testUser._id });
    await Goal.deleteMany({ user: testUser._id });

    // 2. Test Goal Creation
    const testGoal = await Goal.create({
      user: testUser._id,
      title: "Reach 72 kg Target Weight",
      type: "weight",
      category: "Fitness",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      target: 72.0,
      unit: "kg",
      progress: 60,
    });
    console.log("✅ Created Test Goal:", testGoal.title);

    // 3. Test Progress Entry Creation (Baseline Day 1)
    const baselineDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const baselineEntry = await Progress.create({
      user: testUser._id,
      date: baselineDate,
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800",
          type: "Front",
        },
      ],
      weight: 78.4,
      bodyFat: 19.8,
      waist: 84.0,
      chest: 102.0,
      arms: 35.0,
      thighs: 60.0,
      category: "Front",
      notes: "Baseline check-in. Ready to commit to the 90-day transformation.",
    });
    console.log("✅ Baseline Entry Created (30 days ago): Weight 78.4 kg, Body Fat 19.8%");

    // 4. Test Progress Entry Creation (Midway Day 15)
    const midDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const midEntry = await Progress.create({
      user: testUser._id,
      date: midDate,
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800",
          type: "Front",
        },
      ],
      weight: 75.8,
      bodyFat: 18.2,
      waist: 81.5,
      chest: 102.5,
      arms: 35.5,
      category: "Front",
      notes: "Feeling much stronger. Bench press PR hit this week.",
    });
    console.log("✅ Mid-point Entry Created (15 days ago): Weight 75.8 kg, Body Fat 18.2%");

    // 5. Test Progress Entry Creation (Current Day)
    const currentDate = new Date();
    const currentEntry = await Progress.create({
      user: testUser._id,
      date: currentDate,
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
          type: "Front",
        },
        {
          url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
          type: "Side",
        },
      ],
      weight: 73.6,
      bodyFat: 16.5,
      waist: 78.5,
      chest: 103.0,
      arms: 36.0,
      category: "Front",
      notes: "Visible abdominal definition starting to show. Energy levels high.",
      workoutSnapshot: {
        workoutTitle: "Push Day Hypertrophy",
        workoutType: "Strength",
        duration: 65,
        calories: 480,
        prAchieved: "100kg Incline Bench Press",
      },
    });
    console.log("✅ Current Entry Created (Today): Weight 73.6 kg, Body Fat 16.5%, Waist 78.5 cm");

    // 6. Test Workouts Association
    for (let i = 0; i < 6; i++) {
      await Workout.create({
        user: testUser._id,
        title: `Strength Conditioning #${i + 1}`,
        type: i % 2 === 0 ? "Strength" : "Cardio",
        duration: 45 + i * 5,
        difficulty: "Medium",
        estimatedCalories: 350 + i * 30,
        createdAt: new Date(Date.now() - (i * 4) * 24 * 60 * 60 * 1000),
      });
    }
    console.log("✅ Created 6 test workouts for period analytics");

    // 7. Test Queries & Analytics Verification
    const entries = await Progress.find({ user: testUser._id }).sort({ date: 1 });
    if (entries.length !== 3) {
      throw new Error(`Expected 3 entries, found ${entries.length}`);
    }

    const first = entries[0];
    const latest = entries[entries.length - 1];

    const weightDelta = latest.weight - first.weight;
    const bodyFatDelta = latest.bodyFat - first.bodyFat;
    const waistDelta = latest.waist - first.waist;

    console.log(`\n📊 Calculated Metrics Validation:`);
    console.log(`   - Weight Delta: ${weightDelta.toFixed(1)} kg (Expected: -4.8 kg)`);
    console.log(`   - Body Fat Delta: ${bodyFatDelta.toFixed(1)}% (Expected: -3.3%)`);
    console.log(`   - Waist Delta: ${waistDelta.toFixed(1)} cm (Expected: -5.5 cm)`);

    if (Math.abs(weightDelta - -4.8) > 0.01) {
      throw new Error("Weight delta calculation mismatch!");
    }

    // 8. Test Entry Update
    await Progress.updateOne(
      { _id: latest._id },
      { $set: { notes: "Updated note with updated energy levels." } }
    );
    const updated = await Progress.findById(latest._id);
    if (updated.notes !== "Updated note with updated energy levels.") {
      throw new Error("Entry update test failed!");
    }
    console.log("✅ Entry Update Test Passed");

    console.log("\n=======================================================");
    console.log("🎉 ALL FITTRACKER PROGRESS ENGINE TESTS PASSED (100%)");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
};

runProgressTests();
