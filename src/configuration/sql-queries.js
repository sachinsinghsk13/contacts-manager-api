module.exports.CREATE_NEW_USER = `INSERT INTO users (fullname, email, password)
 VALUES (?, ?, ?)`;
module.exports.INSERT_VERIFICATION_TOKEN = `INSERT INTO verificationTokens 
(userId, token, expiry) VALUES (?, ?, ?)`;

module.exports.GET_USER_BY_VERIFICATION_TOKEN = `SELECT userId FROM verificationTokens 
WHERE token = ?`;

module.exports.ACTIVATE_USER = `UPDATE users SET isActive = TRUE WHERE userId = ?`;
