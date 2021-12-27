const request = require('supertest');
const { app } = require('../app');
const faker = require('faker');

describe('POST /auth/login', () => {
    test('It should return a 200 for a successful login', () => {
        const email = 'aoamusat@gmail.com';
        const password = '1234567890';

        const data = {
            email: email,
            password: password,
        };

        return request(app)
            .post('/auth/login')
            .send(data)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.email).toBe(email);
                expect(response.body.loggedIn).toBeTruthy();
            });
    });

    test('It should return a 401 for invalid login', () => {
        const email = 'username@domain.com';
        const password = 'someSpookys3cret';

        const data = {
            email: email,
            password: password,
        };

        return request(app)
            .post('/auth/login')
            .send(data)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.statusCode).toBe(401);
                expect(response.body.email).toBe(email);
                expect(response.body.loggedIn).toBeFalsy();
            });
    });
});
