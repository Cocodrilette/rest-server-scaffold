const haveApiKey = (req, res = response, next) => {
  const apiKey = req.header("x-api-key");
  const role = req.body.role;

  if (role == "ADMIN_ROLE") {
    res.status(401).json({
      Error: "You are not authorize to do that.",
    });
  }

  if (!apiKey) {
    return res.status(401).json({
      msg: "No API key provided",
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      msg: "Invalid API key",
    });
  }

  next();
};

const haveAdminKey = (req, res = response, next) => {
  const adminKey = req.header("x-api-key");
  if (!adminKey) {
    return res.status(401).json({
      msg: "No Admin key provided",
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      msg: "Invalid Admin key",
    });
  }

  next();
};

module.exports = {
  haveApiKey,
  haveAdminKey,
};
