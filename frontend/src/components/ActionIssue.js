import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ActionIssue() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ assetId: '', employeeId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/assets`).then(res => {
      setAssets(res.data.filter(a => a.status === 'in_stock'));
    });
    axios.get(`${process.env.REACT_APP_API_URL}/employees`).then(res => {
      setEmployees(res.data.filter(e => e.status === 'active'));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/actions/issue`, formData)
      .then(() => navigate('/'))
      .catch(err => alert('Error issuing asset'));
  };

  return (
    <div>
      <h1>Issue Asset</h1>
      <div className="card shadow-sm mt-4 border-0" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Asset</label>
              <select className="form-select" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a._id} value={a._id}>{a.uniqueId} - {a.make} {a.model}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Employee</label>
              <select className="form-select" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.department})</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary px-4" type="submit">Issue Asset</button>
              <button className="btn btn-light border" type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
