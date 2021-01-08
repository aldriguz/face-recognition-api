const Clarifai = require('clarifai');

/**
 * external parameters for the app
 */
const app = new Clarifai.App({
	apiKey: '514ae3e3dae449c28602447b1803d951'
   });
  
const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, this.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			res.status(500).json('error when connecting')
		})	
}

const handleImage = (req, res) => {

	const { id } = req.body;
		
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries);
		})
		.catch(err => {
			res.status(400).json('Unable to get entries')
		});
}

module.exports = {
    handleImage: handleImage
}