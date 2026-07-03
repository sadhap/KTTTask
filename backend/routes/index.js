var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/', async function(req, res, next) {
  try {
    const assets = await db.Asset.find({ status: 'in_stock' }).populate('AssetCategory');
    
    let totalValue = 0;
    const branchTotals = {};
    
    assets.forEach(asset => {
      totalValue += asset.value || 0;
      const branch = asset.branch || 'Unknown';
      if (!branchTotals[branch]) {
        branchTotals[branch] = 0;
      }
      branchTotals[branch]++;
    });

    res.json({ assets, totalValue, branchTotals });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
