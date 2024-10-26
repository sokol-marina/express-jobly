const db = require('../db');
const Job = require('../models/job');
const { BadRequestError, NotFoundError } = require('../expressError');

beforeAll(async () => {
  await db.query(`
      INSERT INTO jobs (title, salary, equity, company_handle)
      VALUES ('Software Engineer', 100000, '0.1', 'c1'),
             ('Product Manager', 120000, '0', 'c2')`);
});

afterAll(async () => {
  await db.query('DELETE FROM jobs');
  await db.end();
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

describe('get', function () {
  test('works', async function () {
    const job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
      title: 'Software Engineer',
      salary: 100000,
      equity: '0.1',
      companyHandle: 'c1',
    });
  });
  test('not found if no such job', async function () {
    try {
      await Job.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
describe('remove', function () {
  test('works', async function () {
    await Job.remove(1);
    const jobs = await Job.findAll();
    expect(jobs.length).toEqual(1); // One job was deleted
  });
});
