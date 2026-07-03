const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb+srv://sadhasivam:aFg6BuymtUZ7V7r1@sadhacluster.agcnpf2.mongodb.net/taskmanager?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const AssetCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const AssetSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true, unique: true },
  serialNumber: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  status: { type: String, enum: ['in_stock', 'issued', 'scrapped'], default: 'in_stock' },
  branch: { type: String },
  value: { type: Number, default: 0 },
  AssetCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'AssetCategory' },
  Employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const AssetHistorySchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  action: { type: String, required: true },
  reason: { type: String },
  date: { type: Date, default: Date.now },
  Employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = {
  mongoose,
  Employee: mongoose.model('Employee', EmployeeSchema),
  AssetCategory: mongoose.model('AssetCategory', AssetCategorySchema),
  Asset: mongoose.model('Asset', AssetSchema),
  AssetHistory: mongoose.model('AssetHistory', AssetHistorySchema)
};
