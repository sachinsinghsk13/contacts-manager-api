const express = require('express');
const router = express.Router();
const contactsRepo = require('../repositories/contacts-repo');
router.post('/', async (req, res) => {
    const contact = req.body;
    const currentUserId = req.user.id;
    try {
        let result = await contactsRepo.saveNewContact(contact, currentUserId);
        console.log(result);
        res.status(201).json({
            message: 'Contact Saved!',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).end();
    }
});

module.exports = router;