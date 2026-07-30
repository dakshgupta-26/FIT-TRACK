// import {
//   sendWelcomeEmail,
//   sendLoginNotification,
//   getUserLocationAndIP,
// } from "../services/emailService.js";

// export const handleWelcomeEmail = async (req, res) => {
//   try {
//     const { userData } = req.body;
//     if (!userData || !userData.email)
//       return res
//         .status(400)
//         .json({ error: "User data and email are required" });
//     const result = await sendWelcomeEmail(userData);
//     if (result.success) {
//       res.json({
//         success: true,
//         message: "Welcome email sent",
//         messageId: result.messageId,
//       });
//     } else {
//       res.status(500).json({ success: false, error: result.error });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const handleLoginNotification = async (req, res) => {
//   try {
//     const { userData } = req.body;
//     if (!userData || !userData.email)
//       return res
//         .status(400)
//         .json({ error: "User data and email are required" });
//     const realLocationInfo = await getUserLocationAndIP(req);
//     const result = await sendLoginNotification(userData, realLocationInfo);
//     if (result.success) {
//       res.json({
//         success: true,
//         message: "Login notification sent",
//         messageId: result.messageId,
//       });
//     } else {
//       res.status(500).json({ success: false, error: result.error });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };