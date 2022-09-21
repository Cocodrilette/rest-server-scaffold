const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (!req.userAuthenticated) {
    return res.status(500).json({
      Error: "You need a valid token.",
    });
  }

  const { role } = req.userAuthenticated;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      Error: "You are not authorized to do this action.",
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req, res = response, next) => {
    //
    if (!req.userAuthenticated) {
      return res.status(500).json({
        Error: "You need a valid token.",
      });
    }

    const { role } = req.userAuthenticated;
    const roleIsValid = roles.includes(role);

    if (!roleIsValid) {
      return res.status(401).json({
        Error: "You are not authorized to do this action.",
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  haveRole,
};
