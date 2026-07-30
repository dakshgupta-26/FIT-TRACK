import Goal from "../models/goal.model.js";

// @desc    Get all goals for a user
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      targetDate: "asc",
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
export const addGoal = async (req, res) => {
  try {
    const newGoal = new Goal({
      ...req.body,
      user: req.user._id, // Associate goal with the logged-in user
    });

    const createdGoal = await newGoal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid goal data", error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Ensure the user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this goal" });
    }

    // Only allow updating specific fields
    const { title, description, progress, status, target } = req.body;
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (progress !== undefined) goal.progress = progress;
    if (status) goal.status = status;
    if (target) goal.target = target;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this goal" });
    }

    await Goal.deleteOne({ _id: req.params.id });
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};