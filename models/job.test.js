const db = require('../db');
const Job = require('../models/jobs');
const { BadRequestError, NotFoundError } = require('../expressError');

beforeAll(async () => {
  await db.query(`
      INSERT INTO jobs (title, salary, equity, company_handle)
      VALUES ('Software Engineer', 100000, '0.1', 'c1'),
             ('Product Manager', 120000, '0', 'c2')`);
});

describe('create', function () {
  test('works', async function () {
    const job = await Job.create({
      title: 'Designer',
      salary: 80000,
      equity: '0',
      companyHandle: 'c3',
    });
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'Designer',
      salary: 80000,
      equity: '0',
      companyHandle: 'c3',
    });
  });
});

describe('findAll', function () {
  test('works', async function () {
    const jobs = await Job.findAll();
    expect(jobs.length).toBeGreaterThan(0);
  });
});
afterAll(async () => {
  await db.query('DELETE FROM jobs');
  await db.end();
});
