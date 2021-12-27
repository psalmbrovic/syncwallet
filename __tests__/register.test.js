const request = require('supertest');
const { app } = require('../app');
const faker = require('faker');

describe('POST /auth/signup', () => {
    const email = faker.internet.email();
    const password = faker.internet.password(8);
    const name = faker.name.findName();

    test('It should return a 201 for a successful signup', () => {
        const data = {
            email: email,
            password: password,
            name: name,
        };

        return request(app)
            .post('/auth/signup')
            .send(data)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(response.body.email).toBe(email);
                expect(response.body.userCreated).toBeTruthy();
            });
    });

    test('Should return 400 for existing user', () => {
        const data = {
            email: email,
            password: password,
            name: name,
        };

        return request(app)
            .post('/auth/signup')
            .send(data)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.userExists).toBeTruthy();
                expect(response.body.userCreated).toBeFalsy();
            });
    });
});
