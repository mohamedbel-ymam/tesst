import React, { useState, useEffect } from 'react';
import {DataTable} from '../data-table/DataTable';      // adjust path as needed
import StudentApi from '../../../services/Api/Admin/StudentApi';           // adjust path as needed
import { studentColumns } from '../../../config/columns';   // wherever your column defs live

export default function AdminStudentsList() {
  const [data, setData] = useState([]);       // initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    StudentApi.all()
      .then(response => {
        setData(response.data.data);          // adjust if your payload shape differs
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
    return <div className="p-4 text-center">🔄 Loading students…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        ❌ Error loading students: {error.message}
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-4 text-gray-500">No students found.</div>;
  }

  return (
    <div className="p-4">
      <DataTable columns={studentColumns} data={data} />
    </div>
  );
}
