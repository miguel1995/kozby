const Usuario = require('../models/Usuario');

const readValidateUser = async (username) => {
  try {

    const user = await Usuario.findOne({ username }).lean();
    return user 

  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }


};

module.exports = {
  readValidateUser,
};
