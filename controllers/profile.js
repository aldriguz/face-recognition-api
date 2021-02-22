const handleProfile = (req, res, db) => {
	const {id} = req.params;

	db.select('*').from('users').where({id}).then(users => {
		if(users.length){
			res.json(users[0]);
		} else {
			res.status(404).json('user not found')
		}		
	}).catch(err => {
		res.status(500).json('Error when searching')
	});
}

const handleProfileUpdate = (req, res, db) => {
	const {id} = req.params;
	const {name, age, pet} = req.body.formInput;

	db('users')
		.where({id})
		.update({name})
		.then( resp => { 
			if (resp) {
				res.json("success");
			} else {
				res.status(400).json('Unable to update')
			}
		})
		.catch(err => {
			res.status(500).json('Error updating the user')
		});
}


module.exports = {
    handleProfile: handleProfile,
	handleProfileUpdate: handleProfileUpdate
}