const registerHandler = (db, bcrypt) => (req, res) => {

    const { email, name, password } = req.body;
    if(!email || !name || !password ) {
        return res.status(400).json('missing data in fields');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        console.log('loginEmail:',loginEmail);
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            console.log('user: ',user);
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => {console.log(err); 
      res.status(400).json(err);})
}

module.exports = {
    registerHandler
}