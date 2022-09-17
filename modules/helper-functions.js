const { db } = require('../modules/initialize-models');

// Checks to see if a user already exists in the database.
async function isIdUnique(id) {
  //FIXME Fix the count() method not being found
  return await db.User.count({
    where: {
      discordId: id,
    },
  }).then((count) => {
    if (count != 0) {
      return false;
    }
    return true;
  });
}

module.exports = { isIdUnique };
