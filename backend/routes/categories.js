var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/', async function(req, res, next) {
  try {
    const categories = await db.AssetCategory.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const category = await db.AssetCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const category = await db.AssetCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not Found' });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    const category = await db.AssetCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Not Found' });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
