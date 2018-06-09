const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const image = require('./controllers/image');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const PORT = process.env.PORT || 5000;

// note - using Heroku env variable for connection string
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'xxx',
    database : 'smart-brain'
  }
});

//console.log(db.select().from('users'));
//console.log(db.select('*').from('users'));

db.select('*').from('users')
.then (data => console.log(data));

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if(!email || !password ) {
    return res.status(400).json('missing data in fields');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        // Unlike what andrei said, there is no need to add a return here.
        // return db.select('*').from('users')
        db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', register.registerHandler(db, bcrypt));

app.get('/profile/:id', (req, res) => {
  profile.profileHandler(req, res, db);
})

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
})

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
})

// app.listen(5000, ()=> {
app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
})
