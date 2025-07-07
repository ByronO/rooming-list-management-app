const request = require('supertest');
const app = require('../app');

describe('Rooming List API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password123' });

    token = res.body.token;
  });

  it('GET /rooming-lists → should return 200 and an array', async () => {
    const res = await request(app)
      .get('/api/rooming-lists')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /rooming-lists/:id/bookings → should return bookings array', async () => {
    const res = await request(app)
      .get('/api/rooming-lists/1/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /rooming-lists → 401 if no token provided', async () => {
    const res = await request(app).get('/api/rooming-lists');
    expect(res.statusCode).toBe(401);
  });
});
