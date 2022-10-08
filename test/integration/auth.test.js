const request = require('supertest');
const {User} = require('../../entities/user/user_model');

describe('auth validation', ()=>{
    beforeEach(() => {server = require('../../socialMedia');});
    afterEach(() => {server.close(); });

    let token;

    const exec = ()=>{
        return request(server)
            .get('/api/users/1')
            .set('x-auth-token', token);
    }
    
    beforeEach( () => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async()=>{
        token = ''
        const res = await exec();
        expect(res.status).toBe(401);
    }),
    it('should return 400 if invalid token passed', async()=>{
        token = 'a'
        const res = await exec();
        expect(res.status).toBe(400);
    })
    it('should go to next middleware if valid token passed', async()=>{
        const res = await exec();
        expect(res.status).toBe(404);
    })
})

