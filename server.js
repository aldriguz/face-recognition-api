
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
const auth = require('./controllers/authorization')


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 


/* prod */
const _DATABASE_URL = process.env.DATABASE_URL;
const _PORT = process.env.PORT;
const _SLL_ENABLED = true;

/* dev */
/*
const _DATABASE_URL = "postgresql://postgres:426430@localhost/face_recognition";
const _PORT = 3000;
const _SLL_ENABLED = false;
*/

console.log(process.env.POSTGRES_HOST);

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.POSTGRES_HOST,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB
		//connectionString : _DATABASE_URL,
		//ssl: _SLL_ENABLED
	}
  });

//db.select('*').from('users').then(data => console.log(data));

const app = express();

console.log('running app service...');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('It´s working'));
app.post('/signin', singin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfile(req, res, db) } );
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) } );
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) } )
app.post('/imageUrl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) } )
app.listen(_PORT, () => {
	console.log('app running at -> ' + _PORT)
 });

