const request = require('supertest');
const {User} = require('../../entities/user/user_model');
let server;

const userInfo1 = {
    name: 'user1', 
    phone: '09121111111', 
    email: 'email1@gmail.com',
    password: 'Passwo0rd1'
}
const userInfo2 = {
    name: 'user2', 
    phone: '09122222222', 
    email: 'email2@gmail.com',
    password: 'Passwo0rd2'
}
const weakUserInfo = {
    name: 'user', 
    phone: '09122222222', 
    email: 'email2@gmail.com',
    password: 'password'
}


describe('/api/users',() =>{

    beforeEach(() => {server = require('../../socialMedia');})
    afterEach(async() => {
        server.close();
        await User.collection.deleteMany({});
    });

    describe('GET /',()=>{
        it('should return all users', async()=>{
            await User.collection.insertMany([userInfo1, userInfo2]);

            const res = await request(server).get('/api/users');
            console.log("get",res.body);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'user1')).toBeTruthy();
            expect(res.body.some(g => g.email === 'email2@gmail.com')).toBeTruthy();

        });
    });
    describe('GET /:id',()=>{
        const token = User().generateAuthToken();
        let userId;
        let password;
    
        const exec = ()=>{
            return request(server)
                .get('/api/users/'+ userId)
                .set('x-auth-token', token);
        }
        beforeEach(async()=>{
            const user = new User(userInfo1);
            await user.save();
            password = user.password;
            userId = user._id;
        })

        it('should return 404 error if id does not find', async()=>{
            userId = '1'
            const res = await exec();
            expect(res.status).toBe(404);
        }),
        it('should return a user if valid id is passed', async()=>{
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('password',password);
        })
    });
    describe('POST /', () =>{
        it('should return 400 if password is weak', async()=>{
            const res = await request(server)
                .post('/api/users/')
                .send(weakUserInfo);
            expect(res.status).toBe(400);
        })
        it('should save user in data base if it is valid', async()=>{
            const res = await request(server)
                .post('/api/users/')
                .send(userInfo1 );
            const user = User.find({email: userInfo1.email});
            expect(user).not.toBeNull();
            console.log("post",res.body);
            expect(res.body).toHaveProperty('name',userInfo1.name);
        })
    })
    describe('PUT /:id', () =>{
        let token;
        let userId;
        let userInfo;
    
        const exec = ()=>{
            return request(server)
                .put('/api/users/'+ userId)
                .set('x-auth-token', token)
                .send(userInfo);
        }
        beforeEach(async()=>{
            const user = new User(userInfo1);
            await user.save();
            token = user.generateAuthToken();
            userId = user._id;
            userInfo = userInfo1;
        })
        it('should return 400 if password is weak', async()=>{
            userInfo = weakUserInfo;
            const res = await exec(); 
            expect(res.status).toBe(400);
        })
        it('should save user in data base if it is valid', async()=>{
            const res = await exec();
            const user = User.find({email: userInfo1.email});
            expect(user).not.toBeNull();
            expect(res.body).toHaveProperty('name',userInfo1.name);
        })
    })
});