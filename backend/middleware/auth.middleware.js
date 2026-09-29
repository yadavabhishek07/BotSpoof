import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "fallback_super_secret_key";
        
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Contains { id: userId }
        
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
