import User from '../models/User.js'; // Adjust the path to your User model definition if needed

/**
 * Authentication middleware for a UID-based system.
 * It verifies that the UID in the request parameters belongs to a valid user.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract UID from request parameters (e.g., /api/progress/:uid)
    const uid = req.params.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Authorization failed: No user ID provided.' });
    }

    // Check if a user with this UID exists in the database
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(401).json({ error: 'Authorization failed: User not found.' });
    }

    // Attach the found user's UID to the request object for use in the next function.
    // We use req.user.id for consistency with the route logic.
    req.user = { id: user.uid };
    
    // Proceed to the next middleware or the route handler
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

export default authMiddleware;
