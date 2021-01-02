
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


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

let id = 3;

//temporal object until get DB working
const database = {
	users: [
		{
			id: 1,
			name: 'kevin',
			email: 'alama@mail.com',
			password: 'pass123',
			entries: 0,
			joinedAt: new Date()
		},
		{
			id: 2,
			name: 'lady',
			email: 'lady@mail.com',
			password: 'passs',
			entries: 0,
			joinedAt: new Date()
		}

	],
	login: [
	{
		id: '1',
		hash: '$2a$10$QwZqAV44G6ROKtNTz4PG.exC4TQ12dsYIhfCNiIRT545qX0bj6UTa',
		email: ''

	}]
}

app.get('/', (req, res) => {
	res.send(database.users);
});

//SIGNIN
app.post('/signin', (req, res) => {

	const params = req.body;

	if(params.email === database.users[0].email &&
		params.password === database.users[0].password){
		
		res.json('success');
	}

	res.status(400).json('failed');
})

//REGISTER
app.post('/register', (req, res) => {

	const {email, name, password} = req.body;


	bcrypt.hash(password, null, null, function(err, hash) {
	    // Store hash in your password DB.
	    console.log(hash);
	});

	database.users.push({
			id: 4,
			name: name,
			email: email,
			password: password,
			entries: 0,
			joinedAt: new Date()
		});

	//id++; //for new user
	res.json(database.users[database.users.length - 1]);	
})


app.get('/profile/:id', (req, res) => {

	const {id} = req.params;
	let found = false;

	database.users.forEach(user => {
		if( user.id === id){
			found = true;
			return res.json(user);
		}
	});

	if(!found)
		return res.status(404).json('not user found');
});


app.put('/image', (req, res) => {

	const {id} = req.body;
	let found = false;

	database.users.forEach(user => {
		if( user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});

	if(!found)
		return res.status(404).json('not user found');

})

app.listen(4000, () => {

});

