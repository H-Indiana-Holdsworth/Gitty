const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('lists posts after redirect from oauth', async () => {
    const agent = request.agent(app);

    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const post1 = {
      id: expect.any(String),
      text: 'Yeet yeet post',
    };

    const post2 = {
      id: expect.any(String),
      text: 'Post malone',
    };

    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([post1, post2]);
  });

  it('creates a post if user is signed in', async () => {
    const agent = request.agent(app);

    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const res = await agent.post('/api/v1/posts').send({
      text: 'A post',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'A post',
    });
  });
});
