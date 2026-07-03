var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/', async function(req, res, next) {
  try {
    const assets = await db.Asset.find({
      status: { $in: ['in_stock', 'issued'] }
    }).populate('AssetCategory Employee');
    res.json(assets);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const asset = await db.Asset.create(req.body);
    await db.AssetHistory.create({
      assetId: asset._id,
      action: 'Purchased'
    });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const asset = await db.Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Not Found' });
    res.json(asset);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    const asset = await db.Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: 'Not Found' });
    res.json(asset);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/history', async function(req, res, next) {
  try {
    const history = await db.AssetHistory.find({ assetId: req.params.id })
      .populate('Employee')
      .sort({ date: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
