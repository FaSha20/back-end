let server;
const request = require('supertest');


describe('/api/users',() =>{
    beforeEach(() => {server = require('../../socialMedia');});
    afterEach(() => {server.close();});

    describe('GET /',()=>{
        it('should return all posts', async()=>{
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
        });
    });
});