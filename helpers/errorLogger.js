const fs = require("fs");

const errorLogger = (error) => {
  const errorLog = {
    when: new Date().toDateString(),
    error,
  };

  console.log(error);
  fs.writeFileSync("../db/errors.json", errorLog, { encoding: "utf-8" });
};

module.exports = errorLogger;
