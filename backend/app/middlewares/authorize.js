export const authorizeUser = (permittedRoles) => {
  return (req, res, next) => {
    console.log({ "role inside the authorize": req.role });
    if (permittedRoles.includes(req.role)) {
      next();
    } else {
      return res.status(403).json({ error: "Access Denied"});
    }
  };

};