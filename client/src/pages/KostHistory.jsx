import { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosinstance.js';
import TableKostHistory from '../components/table/TableKostHistory.jsx';

function KostHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/me/history')
      .then(({ data }) => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="fw-bold mb-1">Daftar Kost</h1>
      <p className="text-secondary mb-4">Riwayat kost yang pernah Anda sewa</p>
      <TableKostHistory rows={rows} loading={loading} />
    </div>
  );
}

export default KostHistory;
