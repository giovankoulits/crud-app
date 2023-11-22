let thirtyDays = 1000 * 60 * 60 * 24 * 30; //30 days worth of milliseconds

module.exports = {
  maxAge: thirtyDays,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};
