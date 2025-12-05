exports.stripPassword = (user) => {
  user.local.password = "";
  return user;
};
