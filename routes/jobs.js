'use strict';

/** Routes for jobs. */

const express = require('express');
const Job = require('../models/job');
const { ensureAdmin } = require('../middleware/auth');
const router = express.Router();
const { BadRequestError } = require('../expressError');

/** POST /jobs: create a new job (admin only) */
router.post('/', ensureAdmin, async (req, res, next) => {
  try {
    const { title, salary, equity, companyHandle } = req.body;
    if (!title || !companyHandle)
      throw new BadRequestError('Missing required fields');

    const job = await Job.create({ title, salary, equity, companyHandle });
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** GET /jobs: get all jobs (open to all) */
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.findAll();
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /jobs/:id: get a specific job by ID (open to all) */
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /jobs/:id: delete a job (admin only) */
router.delete('/:id', ensureAdmin, async (req, res, next) => {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
