var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/', async function(req, res, next) {
  try {
    const employees = await db.Employee.find();
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const employee = await db.Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const employee = await db.Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Not Found' });
    res.json(employee);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    const employee = await db.Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Not Found' });
    res.json(employee);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
