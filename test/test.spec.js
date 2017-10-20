import request from 'supertest';
import app from '../src/core/app';

describe('General API alive test', () => {
  test('It should response the GET method', async (done) => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: 'NOT_FOUND' });
    done();
  });
});

describe('Register API route', () => {
  test('It should respond with success result', async (done) => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: 'NOT_FOUND' });
    done();
  });
});

describe('Login API route', () => {
  test('It should respond with the token', async (done) => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: 'NOT_FOUND' });
    done();
  });
});
