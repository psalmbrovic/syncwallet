const request = require('supertest');
const { app } = require('../app');

describe('GET /', () => {
    test('Should return 200 for index route', (done) => {
        request(app)
            .get('/')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});
