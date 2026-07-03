import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', department: '', status: 'active' });
  const [editId, setEditId] = useState(null);

  const fetchEmployees = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/employees`)
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // DataTables removed for native React rendering
  }, [employees, loading, showForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`${process.env.REACT_APP_API_URL}/employees/${editId}`, formData).then(() => {
        setShowForm(false);
        fetchEmployees();
      });
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/employees`, formData).then(() => {
        setShowForm(false);
        fetchEmployees();
      });
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      status: employee.status
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div>
        <h1>{editId ? 'Edit Employee' : 'Add Employee'}</h1>
      <div className="card shadow-sm mt-4 border-0" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Name</label>
              <input className="form-control" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input className="form-control" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Department</label>
              <input className="form-control" type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Status</label>
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
        <h1>Employee Master</h1>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setFormData({ name: '', email: '', department: '', status: 'active' }); setShowForm(true); }}>Add Employee</button>
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
                    <th>Email</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp._id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <span className={`badge bg-${emp.status === 'active' ? 'success' : 'secondary'}`}>{emp.status}</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(emp)}>Edit</button>
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
