import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // [req.headers.authorization] --> Whenever the user wants to
  //access a protected route or resource, the user agent should
  //send the JWT, typically in the Authorization header using the Bearer schema.
  // EX: Authorization: Bearer <token>

  const token = req.headers.authorization || "";
  const cleanToken = token.replace(/Bearer\s*/, "");
  // \s --> matches any whhitespace characters (spaces, tabs, linebreaks)
  // * --> matche 0 or more of preceding occurencies

  if (cleanToken) {
    try {
      const decoded = jwt.verify(cleanToken, "secret123");
      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};
