import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/assets`).then(res => {
      setAssets(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // DataTables removed for native React rendering
  }, [assets, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Asset Master</h1>
        <button className="btn btn-primary" onClick={() => navigate('/assets/add')}>Add Asset</button>
      </div>
      <div className="card shadow-sm mt-4 border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" ref={tableRef}>
              <thead className="table-light">
                <tr>
                  <th>Unique ID</th>
                  <th>Serial Number</th>
                  <th>Category</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Status</th>
                  <th>Current Employee</th>
                  <th>Actions</th>
                </tr>
              </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset._id}>
              <td>{asset.uniqueId}</td>
              <td>{asset.serialNumber}</td>
              <td>{asset.AssetCategory?.name}</td>
              <td>{asset.make}</td>
              <td>{asset.model}</td>
              <td>
                <span className={`badge bg-${asset.status === 'in_stock' ? 'success' : asset.status === 'issued' ? 'warning' : 'secondary'}`}>{asset.status}</span>
              </td>
              <td>{asset.Employee ? asset.Employee.name : 'N/A'}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/assets/edit/${asset._id}`)}>Edit</button>
                <button className="btn btn-sm btn-outline-info ms-1" onClick={() => navigate(`/assets/history/${asset._id}`)}>History</button>
              </td>
            </tr>
          ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    uniqueId: '', serialNumber: '', AssetCategory: '', make: '', model: '', branch: '', value: 0
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/categories`).then(res => setCategories(res.data));
    if (mode === 'edit' && id) {
      axios.get(`${process.env.REACT_APP_API_URL}/assets/${id}`).then(res => {
        setFormData(res.data);
      });
    }
  }, [mode, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit') {
      axios.put(`${process.env.REACT_APP_API_URL}/assets/${id}`, formData).then(() => navigate('/assets'));
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/assets`, formData).then(() => navigate('/assets'));
    }
  };

  return (
    <div>
      <h1>{mode === 'edit' ? 'Edit Asset' : 'Add Asset'}</h1>
      <div className="card shadow-sm mt-4 border-0" style={{ maxWidth: '800px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Unique ID</label>
                <input className="form-control" type="text" value={formData.uniqueId || ''} onChange={e => setFormData({...formData, uniqueId: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Serial Number</label>
                <input className="form-control" type="text" value={formData.serialNumber || ''} onChange={e => setFormData({...formData, serialNumber: e.target.value})} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Category</label>
              <select className="form-select" value={formData.AssetCategory || ''} onChange={e => setFormData({...formData, AssetCategory: e.target.value})} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Make</label>
                <input className="form-control" type="text" value={formData.make || ''} onChange={e => setFormData({...formData, make: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Model</label>
                <input className="form-control" type="text" value={formData.model || ''} onChange={e => setFormData({...formData, model: e.target.value})} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Branch</label>
                <input className="form-control" type="text" value={formData.branch || ''} onChange={e => setFormData({...formData, branch: e.target.value})} />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Value</label>
                <input className="form-control" type="number" step="0.01" value={formData.value || 0} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary px-4" type="submit">Save</button>
              <button className="btn btn-light border" type="button" onClick={() => navigate('/assets')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AssetHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/assets/${id}`).then(res => setAsset(res.data));
    axios.get(`${process.env.REACT_APP_API_URL}/assets/${id}/history`).then(res => setHistory(res.data));
  }, [id]);

  return (
    <div>
      <h1>Asset History</h1>
      {asset && <h3>Asset: {asset.uniqueId} ({asset.make} {asset.model})</h3>}
      <div className="card shadow-sm mt-4 border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Employee</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h._id}>
                    <td>{new Date(h.date).toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${h.action === 'Issued' ? 'warning' : h.action === 'Returned' ? 'success' : h.action === 'Scrapped' ? 'danger' : 'primary'}`}>{h.action}</span>
                    </td>
                    <td>{h.Employee ? h.Employee.name : 'N/A'}</td>
                    <td>{h.reason || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button className="btn btn-light border mt-4" onClick={() => navigate('/assets')}>Back to Assets</button>
    </div>
  );
}

export default function AssetMaster() {
  return (
    <Routes>
      <Route path="/" element={<AssetList />} />
      <Route path="/add" element={<AssetForm mode="add" />} />
      <Route path="/edit/:id" element={<AssetForm mode="edit" />} />
      <Route path="/history/:id" element={<AssetHistory />} />
    </Routes>
  );
}
