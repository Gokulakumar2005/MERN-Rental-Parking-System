


export const authorizeUser = (permittedRoles) => {
  return (req, res, next) => {
    // const userRole = req.user?.role; 
    // console.log({"role inside the authorize":userRole});
    //  console.log({"role inside the authorize":req.role});
    // console.log({"Body inside the Authorize ":req.body})

    if (permittedRoles.includes(req.role)) {
    //   console.log({ role: userRole });

      next();
    } else {
      return res.status(403).json({ error: "Access Denied" });
    }
  };
};