import request from 'supertest';
import app from '../src';

describe('API routes test', () => {
  test('It should response the GET method', async (done) => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: false, payload: 'NOT_FOUND' });
    done();
  });
});
