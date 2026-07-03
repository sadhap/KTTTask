import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default function Dashboard() {
  const [data, setData] = useState({ assets: [], totalValue: 0, branchTotals: {} });
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // DataTables removed for native React rendering
  }, [data, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard - Stock View</h1>
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h3 className="mb-0">Assets in Stock</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" ref={tableRef}>
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Serial Number</th>
                      <th>Branch</th>
                      <th>Value</th>
                    </tr>
                  </thead>
            <tbody>
              {data.assets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.uniqueId}</td>
                  <td>{asset.AssetCategory?.name}</td>
                  <td>{asset.make}</td>
                  <td>{asset.model}</td>
                  <td>{asset.serialNumber}</td>
                  <td>{asset.branch}</td>
                  <td>{asset.value}</td>
                </tr>
              ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 fs-5 text-end text-success">
                <strong>Total Value in Stock: ${data.totalValue}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h3 className="mb-0">Branch Totals</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Branch</th>
                      <th>Total Assets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.branchTotals).map(([branch, total]) => (
                      <tr key={branch}>
                        <td>{branch}</td>
                        <td>
                          <span className="badge bg-primary rounded-pill">{total}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
