const bcrypt = require('bcryptjs');

const hashPassword = (inputPassword) => {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(inputPassword, saltRounds);

    return hashedPassword;
};

const comparePassword = (inputPassword, storedHashedPassword) => {
    return bcrypt.compareSync(inputPassword, storedHashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
};