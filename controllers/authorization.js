const redisClient = require('./singin').redisClient;

const requireAuth = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json('Unauthorized');    
    }

    return redisClient.get(authorization, (err, reply) => {
        if(err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        console.log('calling next call (authorized)');
        return next();
    });

}

module.exports = {
    requireAuth: requireAuth
}