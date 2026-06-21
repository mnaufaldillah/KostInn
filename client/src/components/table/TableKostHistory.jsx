import PropTypes from 'prop-types';

const formatIDR = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return '-';
  return `Rp ${num.toLocaleString('id-ID')},-`;
};

const formatDate = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
};

function TableKostHistory({ rows, loading }) {
  if (loading) return <p className="text-secondary">Memuat riwayat kost...</p>;

  if (!rows.length) {
    return <p className="text-secondary">Belum ada riwayat kost.</p>;
  }

  return (
    <div className="ki-table-wrap">
      <table className="table ki-table">
        <thead>
          <tr>
            <th>Nama Kost</th>
            <th>Nomor Kost</th>
            <th>Tanggal Masuk</th>
            <th>Tanggal Keluar</th>
            <th>Harga Sewa per Bulan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => {
            const room = h.RoomKost || {};
            return (
              <tr key={h.id}>
                <td>Kost Kamar {room.roomNum ?? '-'}</td>
                <td>{room.roomNum ?? '-'}</td>
                <td>{formatDate(h.startDate)}</td>
                <td>{formatDate(h.endDate)}</td>
                <td>{formatIDR(room.roomPrice)}</td>
                <td><span className={`ki-status ki-status-${(h.status || '').toLowerCase()}`}>{h.status || '-'}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

TableKostHistory.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

TableKostHistory.defaultProps = {
  rows: [],
  loading: false,
};

export default TableKostHistory;
