const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            // If no Authorization header is present, respond with 401 Unauthorized
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];
        if (!token) {
            // If no token is present after the Bearer prefix, respond with 401 Unauthorized
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user ID to the request body
        req.body.userId = decoded.userId;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        // If the token is invalid or expired, respond with 401 Unauthorized
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
