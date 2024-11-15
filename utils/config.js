const { JWT_SECRET = "super-strong-secret" } = process.env;

console.log(JWT_SECRET);
module.exports = {
  JWT_SECRET,
};
