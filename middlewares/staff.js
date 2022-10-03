module.exports = function (req, res, next) {
  if (req.user) {
    if (req.user.role != "STAFF") return res.status(403).send("Access Denied!");
  } else {
    return res.status(403).send("Access Denied!");
  }

  next();
};
