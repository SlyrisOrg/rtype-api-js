import request from 'supertest';

import app from '../src';

describe('General API alive test', () => {
  test('It should response the GET method', async (done) => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: { id: 0, name: 'NOT_FOUND' } });
    done();
  });

  test('It should respond with success result', async (done) => {
    const res = await request(app).post('/api/signin');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: { id: 2, name: 'USER_EMAIL_EMPTY' } });
    done();
  });

  test('It should respond with the token', async (done) => {
    const res = await request(app).post('/api/signup');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: { id: 0, name: 'NOT_FOUND' } });
    done();
  });
});
