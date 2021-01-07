
/*

API design

/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user updated


*/

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register')

const db = knex({
	client: 'pg',
	version: '7.2',
		connection: {
		host : '127.0.0.1',
		user : 'postgres',
		password : '426430',
		database : 'face_recognition'
		}
  });

//db.select('*').from('users').then(data => console.log(data));

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	db.select('*').from('users')
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.status(500).json('Error when loading data');
		})
});

//SIGNIN
app.post('/signin', (req, res) => {

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
		
})

//REGISTER
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});


app.get('/profile/:id', (req, res) => {
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
});


app.put('/image', (req, res) => {

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
})

app.listen(4000, () => {

});

