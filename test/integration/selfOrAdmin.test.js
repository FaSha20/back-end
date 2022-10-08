const request = require('supertest');
const {User} = require('../../entities/user/user_model');
const userInfo = {
    name: 'user1', 
    phone: '09121111111', 
    email: 'email4@gmail.com',
    password: 'Passwo0rd1'
}

describe('selfOrAdmin access', ()=>{
    beforeEach(() => {server = require('../../socialMedia');});
    afterEach(async() => {
        server.close();
        await User.collection.deleteMany({});
    });

    let token;
    let id;

    const exec = ()=>{
        return request(server)
            .put('/api/users/' + id)
            .set('x-auth-token', token)
            .send(userInfo);
    }
    
    beforeEach( async() => {
        const user = new User(userInfo);
        await user.save();
        token = user.generateAuthToken();
        id = user._id;
    })
    afterEach(async() => {
        await User.collection.deleteMany({});
    });

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
    it('should return 403 if passed token does not belong to admin or user it self', async()=>{
        id = '1'
        const res = await exec();
        expect(res.status).toBe(403);
    })
    it('should go to next middleware if valid token passed', async()=>{
        const res = await exec();
        expect(res.status).toBe(400);
    })
})

