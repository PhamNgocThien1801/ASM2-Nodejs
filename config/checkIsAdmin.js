module.exports = function (isAdmin) {
  if (isAdmin) {
    return true;
  }
  return false;
};
