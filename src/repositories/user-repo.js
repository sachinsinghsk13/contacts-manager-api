const pool = require('../configuration/database-pool');
const { v4: uuidv4 } = require('uuid');
const { CREATE_NEW_USER, INSERT_VERIFICATION_TOKEN, GET_USER_BY_VERIFICATION_TOKEN, ACTIVATE_USER } = require('../configuration/sql-queries');
const { CustomerError, CustomMessage } = require('../utils/util-classes');
class UserRepository {

    constructor(pool) {
        this.pool = pool;
    }

    async registerUser(user) {
        let conn;
        try {
            // obtain connection
            conn = await this.pool.getConnection();
            // start transaction
            conn.beginTransaction();
            let [userResult] = await conn.query(CREATE_NEW_USER, [user.fullname, user.email, user.password]);
            let token = uuidv4();
            let userId = userResult.insertId;
            let [tokenResult] = await conn.query(INSERT_VERIFICATION_TOKEN, [userId, token, '2022-01-01']);
            conn.commit();
            return { userId, token };
        } catch (error) {
            if (conn)
                conn.rollback();
            if (error.errno == 1062)
                return new CustomMessage
                    (false, 'Email already registered');
            throw new CustomMessage
                (false, 'Something went wrong! we are fixing it.');
        }
        finally {
            if (conn)
                conn.release();
        }
    }

    async getUserByVerificationToken(token) {
        let conn = await this.pool.getConnection();
        let [result, fields] = await conn.query(GET_USER_BY_VERIFICATION_TOKEN, [token]);
        // user is found with given token
        if (result.length > 0) {
            let actived = await conn.query(ACTIVATE_USER, [result[0].userId]);
            return new CustomMessage(true, 'Account Activated!');
        }
        // user not found
        else {
            return new CustomMessage(false, 'Vefification Token Not Valid');
        }
    }
}
module.exports = new UserRepository(pool);