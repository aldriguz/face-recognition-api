const handleSignin = (req, res, db, bcrypt) => {

	const params = req.body;

	db.select('email', 'hash').from('logins')
		.where('email', '=', params.email)
		.then(data => {
			const isValid = bcrypt.compareSync(params.password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', params.email)
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