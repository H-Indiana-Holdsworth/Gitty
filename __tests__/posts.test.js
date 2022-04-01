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

  it('lists posts after redirect from oauth', async () => {
    const agent = request.agent(app);

    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([{ id: expect.any(String), text: 'Test test' }]);
  });
});
