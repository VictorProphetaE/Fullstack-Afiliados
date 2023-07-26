const request = require('supertest');
const app = require('../../app');

const agent = request.agent(app);

describe('Test the file upload and transaction retrieval endpoints', () => {
  it('should upload the file and respond with success', async () => {
    const res = await agent.post('/upload').attach('file', 'sales.txt');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('File uploaded successfully');
  });

  it('should return transactions and totalSales for a given seller', async () => {
    const res = await agent.get('/transactions/JOSE CARLOS');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transactions');
    expect(res.body).toHaveProperty('totalSales');
  });

  it('should return all transactions grouped by seller', async () => {
    const res = await agent.get('/transactions/all');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transactions');
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });
});
