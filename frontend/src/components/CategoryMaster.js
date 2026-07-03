import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default function CategoryMaster() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetchCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/categories`)
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // DataTables removed for native React rendering
  }, [categories, loading, showForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`${process.env.REACT_APP_API_URL}/categories/${editId}`, formData).then(() => {
        setShowForm(false);
        fetchCategories();
      });
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/categories`, formData).then(() => {
        setShowForm(false);
        fetchCategories();
      });
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div>
        <h1>{editId ? 'Edit Category' : 'Add Category'}</h1>
      <div className="card shadow-sm mt-4 border-0" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Name</label>
              <input className="form-control" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary px-4" type="submit">Save</button>
              <button className="btn btn-light border" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Asset Category Master</h1>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setFormData({ name: '', description: '' }); setShowForm(true); }}>Add Category</button>
      </div>
      <div className="card shadow-sm mt-4 border-0">
        <div className="card-body">
          {loading ? <div>Loading...</div> : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" ref={tableRef}>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat._id}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(cat)}>Edit</button>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
