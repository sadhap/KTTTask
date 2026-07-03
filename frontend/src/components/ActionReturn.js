import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ActionReturn() {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ assetId: '', reason: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/assets`).then(res => {
      setAssets(res.data.filter(a => a.status === 'issued'));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/actions/return`, formData)
      .then(() => navigate('/'))
      .catch(err => alert('Error returning asset'));
  };

  return (
    <div>
      <h1>Return Asset</h1>
      <div className="card shadow-sm mt-4 border-0" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Asset</label>
              <select className="form-select" value={formData.assetId} onChange={e => setFormData({ ...formData, assetId: e.target.value })} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a._id} value={a._id}>{a.uniqueId} - Issued to: {a.Employee ? a.Employee.name : 'Unknown'}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Reason for Return</label>
              <select className="form-select" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required>
                <option value="">Select Reason</option>
                <option value="upgrade">Upgrade</option>
                <option value="repair">Repair</option>
                <option value="resignation">Resignation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary px-4" type="submit">Return Asset</button>
              <button className="btn btn-light border" type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
