const express = require('express');
const app = express();
require('dotenv').config(); // load application environment variables
const jwtAuthFilter = require('./routes/middlewares/jwt-auth-filter');
const contactsRoute = require('./routes/contacts-routes');
app.use(express.json());
app.use(express.urlencoded());

const authRoutes = require('./routes/auth-routes');
const masterRoute = express();
masterRoute.use('/contacts', contactsRoute);











app.use('/auth', authRoutes);
app.use('/api',jwtAuthFilter, masterRoute);

app.listen(process.env.PORT, () => {
    console.log(" *** Contacts Manager API v1.0 ***");
    console.log(`Server is running on port ${process.env.PORT}`);
});