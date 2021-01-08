
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
const singin = require('./controllers/singin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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



app.post('/signin', (req, res) => { singin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id',  (req, res) => { profile.handleRegister(req, res, db) } );
app.put('/image', (req, res) => { image.handleImage(req, res, db) } )
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) } )
app.listen(4000, () => { });

