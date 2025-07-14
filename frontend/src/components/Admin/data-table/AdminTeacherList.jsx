import React, { useState, useEffect } from 'react';
import {DataTable} from '../data-table/DataTable';      // adjust path as needed
import TeacherApi from '../../../services/Api/Admin/TeacherApi'; // adjust path as needed
import { teacherColumns } from '../../../config/columns';    // <-- use teacherColumns

export default function AdminTeacherList() {
  const [data, setData] = useState([]);       // initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    TeacherApi.all()
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
    return <div className="p-4 text-center">🔄 Loading teachers…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        ❌ Error loading teachers: {error.message}
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-4 text-gray-500">No teachers found.</div>;
  }

  return (
    <div className="p-4">
      <DataTable columns={teacherColumns} data={data} />
    </div>
  );
}
