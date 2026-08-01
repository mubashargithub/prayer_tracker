const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB, clearDB } = require('./setup');
const User = require('../models/User');
const Dua = require('../models/Dua');

let token;
let userId;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await clearDB();
  
  // Create a test user and generate token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123'
    });
    
  token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
  userId = res.body._id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Dua API Endpoints', () => {
  
  it('should create a new Dua', async () => {
    const res = await request(app)
      .post('/api/duas')
      .set('Cookie', `jwt=${token}`)
      .send({
        title: 'Morning Dua',
        arabicText: 'اللهم بك أصبحنا',
        translation: 'O Allah, by You we enter the morning',
        category: 'Morning'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Morning Dua');
    expect(res.body).toHaveProperty('user', userId.toString());
  });

  it('should get all Duas for the logged in user', async () => {
    // Insert a dua first
    await request(app)
      .post('/api/duas')
      .set('Cookie', `jwt=${token}`)
      .send({
        title: 'Morning Dua',
        arabicText: 'اللهم بك أصبحنا',
        translation: 'O Allah, by You we enter the morning'
      });

    const res = await request(app)
      .get('/api/duas')
      .set('Cookie', `jwt=${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual('Morning Dua');
  });

  it('should mark a Dua as completed for today', async () => {
    // Create a dua
    const createRes = await request(app)
      .post('/api/duas')
      .set('Cookie', `jwt=${token}`)
      .send({
        title: 'Test Dua',
        arabicText: 'Test Arabic',
        translation: 'Test translation'
      });
      
    const duaId = createRes.body._id;

    // Mark as complete
    const completeRes = await request(app)
      .post(`/api/duas/${duaId}/complete`)
      .set('Cookie', `jwt=${token}`);
      
    expect(completeRes.statusCode).toEqual(200);
    expect(completeRes.body.message).toEqual('Dua marked as completed for today');
  });

});
