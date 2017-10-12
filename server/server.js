const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose'),
    {Todo} = require('./models/todo'),
    {User} = require('./models/user');   
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

/*
const ivan = new User({
    name: 'Ivan',
    email: 'putiareddevil@gmail.com'
}).save().then((res) => console.log(JSON.stringify(res,undefined,2)), (err) => console.log(err));
*/
app.listen(3000, () => console.log(`Server starting on port 3000`));

module.exports = {
    app
};
