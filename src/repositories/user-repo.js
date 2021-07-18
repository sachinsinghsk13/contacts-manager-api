const pool = require('../configuration/database-pool');
const { v4: uuidv4 } = require('uuid');
const sql = require('../configuration/sql-queries');
const { CustomerError, CustomMessage } = require('../utils/util-classes');
const bcrypt = require('bcryptjs');

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
            const password = await bcrypt.hash(user.password, bcrypt.genSaltSync());
            let [userResult] = await conn.query(sql.CREATE_NEW_USER, [user.fullname, user.email, password]);
            let token = uuidv4();
            let userId = userResult.insertId;
            let [tokenResult] = await conn.query(sql.INSERT_VERIFICATION_TOKEN, [userId, token, '2022-01-01']);
            conn.commit();
            return { userId, token };
        } catch (error) {
            console.log(error);
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
        let [result, fields] = await conn.query(sql.GET_USER_BY_VERIFICATION_TOKEN, [token]);
        // user is found with given token
        if (result.length > 0) {
            let actived = await conn.query(sql.ACTIVATE_USER, [result[0].userId]);
            return new CustomMessage(true, 'Account Activated!');
        }
        // user not found
        else {
            return new CustomMessage(false, 'Vefification Token Not Valid');
        }
    }

    async getUserByEmail(email) {
        const conn = await this.pool.getConnection();
        let [result, fields] = await conn.query(sql.GET_USER_BY_EMAIL, [email]);
        return result;
    }

    async getUserDetailsByEmail(email) {
        const conn = await this.pool.getConnection();
        let [result, fields] = await conn.query(sql.GET_USER_DETAILS_BY_EMAIL, [email]);
        return result;
    }
}
module.exports = new UserRepository(pool);