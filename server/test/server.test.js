const expect = require('expect'),
    request = require('supertest');
const {app} = require('./../server'),
    {Todo} = require('./../models/todo');

const todos = [
    {
        text: 'First text todo'
    },
    {
        text: 'Second text todo'
    }
];

// beforeEach((done) => {//перед тестом виртуально удаляем все из бд
//     Todo.remove({}).then(() => done());
// });
beforeEach((done) => {//перед тестом виртуально удаляем все из бд
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then((err) => {
        done();
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
    it('should not create todo with invalid body datd', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});