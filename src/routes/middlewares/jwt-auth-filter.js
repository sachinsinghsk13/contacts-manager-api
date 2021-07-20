const jsonwebtoken = require('jsonwebtoken');
const constacts = require('../../utils/constants');
const userRepo = require('../../repositories/user-repo');
const jwtAuthFilter = async (req, res, next) => {
    const authType = req.header('authorization');
    if (authType && authType.startsWith('Bearer ')) {
        const token = authType.substr(7);
        try {
            let payload = jsonwebtoken.verify(token,constacts.TOKEN_SECRET);
            let user = await userRepo.getUserDetailsByEmail(payload.sub);
            req.user = user;
            next();
        } catch(err) {
            res.setHeader('WWW-Authenticate', 'Bearer');
            res.json({message: err.message});
            res.status(401).end();    
        }
    } 
    else {
        res.setHeader('WWW-Authenticate', 'Bearer');
        res.status(401).end();
    }
}

module.exports = jwtAuthFilter;