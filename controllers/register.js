
const handleRegister = (req, res, db, bcrypt) => {

    const {email, name, password} = req.body;
    
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submition');
    }
	
	const hashed = bcrypt.hashSync(password);
	
	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: hashed
		})
		.into('logins')
		.returning('email')
		.then(loginEmail => {
			
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined_at: new Date()
			})
			.then(users => {
				res.json(users[0]) //returning statement allow this
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => {
		console.error(err);
		res.status(500).json('Unable to register')
	});

}

module.exports = {
    handleRegister: handleRegister
}