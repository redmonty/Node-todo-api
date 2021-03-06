require('./config/config')
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    {ObjectID} = require('mongodb'),
    _ = require('lodash');
const {mongoose} = require('./db/mongoose'),
    {Todo} = require('./models/todo'),
    {User} = require('./models/user'),
    {authenticate} = require('./middlewhere/authenticate');

const port = process.env.PORT || 3000; //for heroku

app.use(bodyParser.json());
//Routes
app.post('/todos', (req,res) => {//post to create new todo
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    }).save().then((doc) => {res.send(doc)}, (err) => {res.status(400).send(err);});
});

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        console.log('ID isnt valid');
        return res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if(!todo) {
                console.log('No todo with this id');
                return res.status(404).send();
            }
            console.log(JSON.stringify(todo, undefined, 2));
            res.status(200).send({todo});
        }).catch((err) => console.log(err));
    }
});

app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        console.log('ID isnt valid');
        return res.status(404).send();
    } else {
        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo) {
                console.log('No todo with this id');
                return res.status(404).send();
            }
            console.log(`Todo with id: ${id} was deleted`);
            res.send({todo});
        }).catch((err) => res.status(404).send());
    }
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);//то что можно будет изменить
    if(!ObjectID.isValid(id)) {
        console.log('ID isnt valid');
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {//если это лог тип и true
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) return res.status(404).send();
        res.send({todo});
    }).catch((err) => res.status(404).send());
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });
  
  app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
  });
/*
const ivan = new User({
    name: 'Ivan',
    email: 'putiareddevil@gmail.com'
}).save().then((res) => console.log(JSON.stringify(res,undefined,2)), (err) => console.log(err));
*/
app.listen(port, () => console.log(`Server starting on port ${port}`));

module.exports = {
    app
};
//master
/*
heroku create
heroku addons:create mongolab:sandbox
heroku config   process.env.MONGODB_URI
git push heroku master
heroku logs
heroku open
*/ 