import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EmployeeMaster from './components/EmployeeMaster';
import CategoryMaster from './components/CategoryMaster';
import AssetMaster from './components/AssetMaster';
import ActionIssue from './components/ActionIssue';
import ActionReturn from './components/ActionReturn';
import ActionScrap from './components/ActionScrap';

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">AssetTracker</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employees">Employees</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories">Categories</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/assets">Assets</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Actions
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/actions/issue">Issue Asset</Link></li>
                  <li><Link className="dropdown-item" to="/actions/return">Return Asset</Link></li>
                  <li><Link className="dropdown-item" to="/actions/scrap">Scrap Asset</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeMaster />} />
          <Route path="/categories" element={<CategoryMaster />} />
          <Route path="/assets/*" element={<AssetMaster />} />
          <Route path="/actions/issue" element={<ActionIssue />} />
          <Route path="/actions/return" element={<ActionReturn />} />
          <Route path="/actions/scrap" element={<ActionScrap />} />
        </Routes>
      </div>
    </Router>
  );
}
