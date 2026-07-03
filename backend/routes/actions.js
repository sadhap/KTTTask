var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/issue', async function(req, res, next) {
  try {
    const asset = await db.Asset.findById(req.body.assetId);
    if (!asset || asset.status !== 'in_stock') return res.status(400).json({ message: 'Asset not available' });
    
    asset.status = 'issued';
    asset.Employee = req.body.employeeId;
    await asset.save();

    await db.AssetHistory.create({
      assetId: asset._id,
      Employee: req.body.employeeId,
      action: 'Issued'
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/return', async function(req, res, next) {
  try {
    const asset = await db.Asset.findById(req.body.assetId);
    if (!asset || asset.status !== 'issued') return res.status(400).json({ message: 'Asset not issued' });

    const previousEmployeeId = asset.Employee;

    asset.status = 'in_stock';
    asset.Employee = undefined;
    await asset.save();

    await db.AssetHistory.create({
      assetId: asset._id,
      Employee: previousEmployeeId,
      action: 'Returned',
      reason: req.body.reason
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/scrap', async function(req, res, next) {
  try {
    const asset = await db.Asset.findById(req.body.assetId);
    if (!asset || asset.status !== 'in_stock') return res.status(400).json({ message: 'Asset not in stock' });

    asset.status = 'scrapped';
    await asset.save();

    await db.AssetHistory.create({
      assetId: asset._id,
      action: 'Scrapped',
      reason: req.body.reason
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
