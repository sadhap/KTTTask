import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ActionScrap() {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ assetId: '', reason: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/assets`).then(res => {
      setAssets(res.data.filter(a => a.status === 'in_stock'));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/actions/scrap`, formData)
      .then(() => navigate('/'))
      .catch(err => alert('Error scrapping asset'));
  };

  return (
    <div>
      <h1>Scrap Asset</h1>
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
              <label className="form-label fw-bold">Reason for Scrapping</label>
              <input className="form-control" type="text" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-danger px-4" type="submit">Scrap Asset</button>
              <button className="btn btn-light border" type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
