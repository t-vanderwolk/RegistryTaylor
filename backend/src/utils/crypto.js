const bcrypt = require('bcrypt');

const getRounds = () => Number(process.env.BCRYPT_ROUNDS || 12);

const hashPassword = (password) => bcrypt.hash(password, getRounds());
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const normalizeEmail = (email = '') => email.trim().toLowerCase();

module.exports = {
  hashPassword,
  comparePassword,
  normalizeEmail,
};
