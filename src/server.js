const express = require('express');
const app = express();
require('dotenv').config();


app.listen(process.env.PORT, () => {
    console.log(" *** Contacts Manager API v1.0 ***");
    console.log(`Server is running on port ${process.env.PORT}`);
});