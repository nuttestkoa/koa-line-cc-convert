const request = require('supertest');
const server = require('../app.js');
beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});
// close the server after each test
afterAll(() => {
    server.close();
    console.log('server closed!');
});
describe('basic route tests', () => {
    test('get home route GET /', async () => {
        const response = await request(server).post('/webhook');
        expect(response.status).toEqual(200);
    });
});