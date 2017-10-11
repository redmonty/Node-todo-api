const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
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
