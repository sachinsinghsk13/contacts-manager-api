module.exports.CREATE_NEW_USER = `INSERT INTO users (fullname, email, password)
 VALUES (?, ?, ?)`;
module.exports.INSERT_VERIFICATION_TOKEN = `INSERT INTO verificationTokens 
(userId, token, expiry) VALUES (?, ?, ?)`;

module.exports.GET_USER_BY_VERIFICATION_TOKEN = `SELECT userId FROM verificationTokens 
WHERE token = ?`;

module.exports.ACTIVATE_USER = `UPDATE users SET isActive = TRUE WHERE id = ?`;

module.exports.GET_USER_BY_EMAIL = `SELECT password FROM users WHERE email = ?`;

module.exports.GET_USER_DETAILS_BY_EMAIL= 'SELECT id, fullname, email, createdOn FROM users WHERE email = ?'; 
