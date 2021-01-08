const handleSignin = (req, res, db, bcrypt) => {

	const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json('incorrect form submition');
	}

	db.select('email', 'hash').from('logins')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(users => {
						res.json(users[0])
					})
					.catch(err => {
						res.status(500).json('Error when load data')
					})
			} else {
				res.status(400).json('Worng credentials, try again')	
			}
		})
		.catch(err => {
			console.log(err);
			res.status(400).json('Worng credentials')	
		})
		
}


module.exports = {
    handleSignin: handleSignin
}