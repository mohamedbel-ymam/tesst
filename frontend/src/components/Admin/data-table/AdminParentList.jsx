import React, { useState, useEffect } from 'react';
import {DataTable} from '../data-table/DataTable';  
import ParentApi from '../../../services/Api/Admin/ParentApi';
import { parentColumns } from '../../../config/columns';

export default function AdminParentList() {
  const [data, setData] = useState([]);       // always start as array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    ParentApi.all()
      .then(response => {
        // adjust if your payload shape is different
        setData(response.data.data);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 text-center">🔄 Loading parents…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        ❌ Error loading parents: {error.message}
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-4 text-gray-500">No parents found.</div>;
  }

  return (
    <div className="p-4">
      <DataTable columns={parentColumns} data={data} />
    </div>
  );
}
