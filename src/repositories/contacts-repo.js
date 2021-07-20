const pool = require('../configuration/database-pool');
const sql = require('../configuration/sql-queries');

class ContactsRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async saveNewContact(contact, currentUserId) {
        let conn = await this.pool.getConnection();
        let values = [currentUserId, contact.firstName, contact.lastName, contact.relation, contact.dateOfBirth];
        let [result] = await conn.query(sql.SAVE_NEW_CONTACT,values);
        return result;
    }
}

module.exports = new ContactsRepository(pool);