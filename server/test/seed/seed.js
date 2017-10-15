const {ObjectID} = require('mongodb'),
    jwt = require('jsonwebtoken'),
    {Todo} = require('./../../models/todo'),
    {User} = require('./../../models/user');
const todos = [
    {
        _id: new ObjectID(),
        text: 'First text todo',
        // completedAt: null
    },
    {
        _id: new ObjectID(),
        text: 'Second text todo',
        // completedAt: null
    }
];

const populateTodos = (done) => {//перед тестом виртуально удаляем все из бд
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then((err) => {
        done();
    });
};
const userOneId = new ObjectID(),
    userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: 'ipredmonty@gmail.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth '}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'dasha@gmail.com',
        password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth '}, 'abc123').toString()
        }]
    }
];
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save(),
            userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
};
module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};