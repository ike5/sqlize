const {User} = require('../models/User.js')
/**
 * Checks to see if a user already exists in the database.
 *
 * Parameters:
 *  - discordId
 *
 * Returns:
 *  - true if user doesn't exist
 */
async function isIdUnique(id) {
  //FIXME Fix the count() method not being found
  return await User.count({
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
