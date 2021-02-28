var jwt = require('jsonwebtoken');
const redis = require('redis');

//setup redis:
const redisClient = redis.createClient(process.env.REDIS_HOST)


const getAuthTokenId = (req, res) => {
	const {authorization} = req.headers;

	return redisClient.get(authorization, (err, reply) => {
		if(err || !reply){
			return res.status(401).json('Unauthorized');
		}
		return res.json({ id: reply} );
	})	
}

const signToken = (email) => {	
	const jwtPayload = {email};
	return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '1 days'});
}

const setToken = (key, value) => {
	console.log('resolved setToken');

	return Promise.resolve(redisClient.set(key, value, redis.print));
}


const createSessions = (user) => {
	// JWT Token, return user data
	const {email, id} = user;
	const token = signToken(email);

	//return {success: 'true', userId: id, token};
	return setToken(token, id)
		.then(() => { 
			return {success: 'true', userId: id, token} 
		})
		.catch(console.log);
}

const handleSignin = (req, res, db, bcrypt) => {

	const {email, password} = req.body;
    
    if(!email || !password){
	   return Promise.reject('incorrect form submition');
	}

	return db.select('email', 'hash').from('logins')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(users => users[0])
					.catch(err => Promise.reject('Error when load data'))
			} else {
				Promise.reject('Worng credentials, try again');
			}
		})
		.catch(err => Promise.reject('Worng credentials'));
		
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	
	console.log('authorization', authorization);

	return authorization ? getAuthTokenId(req, res) :
		handleSignin(req, res, db, bcrypt)
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data)
			})
			.then(session => res.json(session))
			.catch(err => res.status(500).json(err))
}

module.exports = {
    signinAuthentication: signinAuthentication
}