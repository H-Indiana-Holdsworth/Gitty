const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a post if user is signed in', async () => {
    const res = await request(app).post('/api/v1/posts').send({
      text: 'A post',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'A post',
    });
  });
});
