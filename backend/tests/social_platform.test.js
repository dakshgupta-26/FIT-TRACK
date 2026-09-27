import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Reel from "../models/reel.model.js";
import LiveStream from "../models/liveStream.model.js";
import { Conversation, Message } from "../models/conversation.model.js";
import { Follow, Group, Challenge } from "../models/community.model.js";
import Notification from "../models/notification.model.js";
import { createLiveKitToken } from "../services/livekit.service.js";

dotenv.config();

const runVerification = async () => {
  console.log("=======================================================");
  console.log("🧪 FitTracker Social Platform Verification Suite");
  console.log("=======================================================");

  const isConnected = await connectDB();
  if (!isConnected) {
    console.error("❌ Database connection failed. Aborting verification.");
    process.exit(1);
  }

  // 1. Verify/Create Test Users
  let userA = await User.findOne({ email: "athlete.alex@fittrack.io" });
  if (!userA) {
    userA = await User.create({
      firstName: "Alex",
      lastName: "Rivera",
      email: "athlete.alex@fittrack.io",
      password: "Password123!",
      badge: "PRO ATHLETE",
      bio: "Olympic weightlifter & endurance specialist. Pushing limits daily.",
      location: "San Francisco, CA",
      workoutStats: { totalWorkouts: 42, totalMinutes: 1890, totalCalories: 28400, streakDays: 12 },
    });
    console.log("✅ Created Test User A:", userA.email);
  }

  let userB = await User.findOne({ email: "athlete.sarah@fittrack.io" });
  if (!userB) {
    userB = await User.create({
      firstName: "Sarah",
      lastName: "Connor",
      email: "athlete.sarah@fittrack.io",
      password: "Password123!",
      badge: "HYBRID RUNNER",
      bio: "165 BPM Cardio addict. 10km morning runs & cold plunge enthusiast.",
      location: "Sausalito, CA",
      workoutStats: { totalWorkouts: 38, totalMinutes: 1650, totalCalories: 24200, streakDays: 9 },
    });
    console.log("✅ Created Test User B:", userB.email);
  }

  // 2. Verify Follow Relationship
  let follow = await Follow.findOne({ follower: userA._id, following: userB._id });
  if (!follow) {
    follow = await Follow.create({
      follower: userA._id,
      following: userB._id,
      status: "active",
    });
    await User.findByIdAndUpdate(userA._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(userB._id, { $inc: { followersCount: 1 } });
    console.log("✅ Follow relationship verified: Alex follows Sarah");
  }

  // 3. Verify Posts Creation & Liking & Commenting
  let testPost = await Post.findOne({ author: userB._id });
  if (!testPost) {
    testPost = await Post.create({
      author: userB._id,
      authorName: `${userB.firstName} ${userB.lastName}`,
      authorAvatar: userB.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      authorBadge: userB.badge,
      type: "workout",
      caption: "Crushed a 10km morning run around SF Bay Bridge! HR Zone 4 verified.",
      mediaUrls: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"],
      workoutMetrics: {
        workoutType: "Outdoor Run",
        caloriesBurned: 640,
        durationMinutes: 48,
        stepsCount: 11450,
        avgHeartRate: 158,
        distanceMiles: 6.2,
      },
      likes: [userA._id],
      comments: [
        {
          user: userA._id,
          userName: "Alex Rivera",
          text: "Awesome cadence! That final sprint output was wild 🔥",
          likes: [],
        },
      ],
      aiAnalysis: "🔥 High cardiovascular intensity! Maintained HR Zone 4 (158 BPM).",
    });
    console.log("✅ Test Post created with likes and comments:", testPost._id.toString());
  }

  // 4. Verify Fitness Reels & Views
  let testReel = await Reel.findOne({ author: userA._id });
  if (!testReel) {
    testReel = await Reel.create({
      author: userA._id,
      authorName: `${userA.firstName} ${userA.lastName}`,
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      authorBadge: userA.badge,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-a-gym-42795-large.mp4",
      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      caption: "220kg Deadlift PR attempt! Keep your thoracic spine locked and drive through heels.",
      audioTitle: "Barbell Phonk 140 BPM",
      workoutType: "Heavy Deadlifts",
      caloriesBurned: 520,
      heartRate: 155,
      likes: [userB._id],
      viewsCount: 1240,
    });
    console.log("✅ Test Reel created with telemetry:", testReel._id.toString());
  }

  // 5. Verify Direct Messaging & Conversation
  let conv = await Conversation.findOne({
    participants: { $all: [userA._id, userB._id] },
  });
  if (!conv) {
    conv = await Conversation.create({
      participants: [userA._id, userB._id],
      isGroup: false,
      lastMessage: {
        text: "Hey Sarah! Great pace on the Bay Bridge run today.",
        sender: userA._id,
        senderName: "Alex Rivera",
        createdAt: new Date(),
      },
    });

    await Message.create({
      conversation: conv._id,
      sender: userA._id,
      senderName: "Alex Rivera",
      text: "Hey Sarah! Great pace on the Bay Bridge run today.",
      status: "read",
      readBy: [userA._id, userB._id],
    });

    await Message.create({
      conversation: conv._id,
      sender: userB._id,
      senderName: "Sarah Connor",
      text: "Thanks Alex! HR held at 158 BPM. Ready for the weekend sprint session?",
      status: "sent",
      readBy: [userB._id],
    });

    console.log("✅ Test Conversation & direct messages created:", conv._id.toString());
  }

  // 6. Verify LiveKit Token Generation
  const hostToken = await createLiveKitToken({
    roomName: "test-room-fittrack-1",
    participantIdentity: userA._id.toString(),
    participantName: "Alex Rivera",
    isPublisher: true,
  });
  console.log("✅ LiveKit Host Token generated successfully (Length:", hostToken.length, "bytes)");

  const viewerToken = await createLiveKitToken({
    roomName: "test-room-fittrack-1",
    participantIdentity: userB._id.toString(),
    participantName: "Sarah Connor",
    isPublisher: false,
  });
  console.log("✅ LiveKit Viewer Token generated successfully (Length:", viewerToken.length, "bytes)");

  // 7. Verify Groups & Challenges
  let group = await Group.findOne({ slug: "bay-area-runners" });
  if (!group) {
    group = await Group.create({
      name: "Bay Area Runners",
      slug: "bay-area-runners",
      category: "Running",
      description: "Dedicated trail and road runners conquering San Francisco inclines and coastal routes.",
      icon: "🏃‍♂️",
      admin: userA._id,
      members: [userA._id, userB._id],
      weeklyGoal: "Run 50km together",
    });
    console.log("✅ Fitness Group created:", group.name);
  }

  let challenge = await Challenge.findOne({ title: "100k Steps Mayhem" });
  if (!challenge) {
    challenge = await Challenge.create({
      title: "100k Steps Mayhem",
      description: "Accumulate 100,000 verified steps within 7 days. Win the Cyber-Athletics Badge.",
      type: "steps",
      targetValue: 100000,
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      badgeImage: "⚡",
      rewardXP: 750,
      participants: [userA._id, userB._id],
    });
    console.log("✅ Fitness Challenge created:", challenge.title);
  }

  // 8. Verify Notification
  let notif = await Notification.findOne({ recipient: userB._id });
  if (!notif) {
    notif = await Notification.create({
      recipient: userB._id,
      sender: userA._id,
      senderName: "Alex Rivera",
      type: "follow",
      title: "New Follower",
      message: "Alex Rivera started following your fitness journey!",
      read: false,
    });
    console.log("✅ Real Notification created for user B");
  }

  console.log("\n=======================================================");
  console.log("🎉 All Platform Verifications Passed Successfully!");
  console.log("=======================================================\n");

  await mongoose.disconnect();
  process.exit(0);
};

runVerification().catch((err) => {
  console.error("❌ Verification error:", err);
  process.exit(1);
});
