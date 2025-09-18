// Filename: server/middleware/userAuth.js
// (Updated by your AI assistant to follow best practices)

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    // Best Practice: Unauthorized ke liye 401 status code bhejna chahiye.
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    // Token ko verify karke poora decoded object nikaalo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- YEH HAI MAIN FIX ---
    // Hum req.userId ki jagah ek poora req.user object banayenge.
    // Yeh ek standard practice hai. 'decoded' object mein id pehle se hoti hai.
    // e.g., decoded = { id: 'someUserId', iat: ..., exp: ... }
    req.user = decoded;

    next(); // Ab controller par jao

  } catch (error) {
    // Best Practice: Token fail hone par bhi 401 status code bhejna chahiye.
    return res.status(401).json({ success: false, message: "Not Authorized. Token failed." });
  }
};

export default userAuth;