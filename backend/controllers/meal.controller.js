import Meal from "../models/meal.model.js";

// @desc    Get all meals for a specific date
// @route   GET /api/meals?date=YYYY-MM-DD
export const getMealsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    // --- START OF FIX ---

    // 1. Create a date object that is explicitly UTC midnight for the requested date.
    //    Appending 'T00:00:00.000Z' removes all ambiguity.
    const startDate = new Date(`${date}T00:00:00.000Z`);

    // 2. Create the end date by adding exactly one day to the start date.
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    const meals = await Meal.find({
      user: req.user._id,
      // 3. Find timestamps that are:
      //    - Greater than or equal to the start of the day (gte)
      //    - AND strictly less than the start of the next day (lt). This is more robust.
      timestamp: { $gte: startDate, $lt: endDate },
    }).sort({ timestamp: "asc" });

    // --- END OF FIX ---

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... (keep the rest of the controller functions: addMeal, updateMeal, etc.)
// @desc    Add a new meal
// @route   POST /api/meals
export const addMeal = async (req, res) => {
  try {
    const { name, timestamp, nutrition } = req.body;

    const meal = new Meal({
      user: req.user._id,
      name,
      timestamp,
      nutrition,
    });

    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid meal data", error: error.message });
  }
};

// @desc    Update a meal
// @route   PUT /api/meals/:id
export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this meal" });
    }

    const { name, nutrition } = req.body;
    meal.name = name || meal.name;
    meal.nutrition = nutrition || meal.nutrition;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this meal" });
    }

    await Meal.deleteOne({ _id: req.params.id });

    res.json({ message: "Meal removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete all meals for a specific date (Reset Day)
// @route   DELETE /api/meals?date=YYYY-MM-DD
export const deleteMealsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    await Meal.deleteMany({
      user: req.user._id,
      timestamp: { $gte: startDate, $lt: endDate },
    });

    res.json({ message: `All meals for ${date} have been removed.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
