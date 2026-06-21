import PropTypes from 'prop-types';

function TableUserList({ rows, loading, onEditProfile, onEditStatus }) {
  if (loading) return <p className="text-secondary">Memuat daftar pengguna...</p>;
  if (!rows.length) return <p className="text-secondary">Belum ada pengguna.</p>;

  return (
    <div className="ki-table-wrap">
      <table className="table ki-table">
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Email</th>
            <th>Status Penghuni</th>
            <th>Akun</th>
            <th className="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>{p.fullname || '-'}</td>
              <td>{p.User?.email || '-'}</td>
              <td>{p.role || '-'}</td>
              <td>
                <span className={`ki-status ki-status-${p.status === 'active' ? 'active' : 'done'}`}>
                  {p.status || '-'}
                </span>
              </td>
              <td className="text-end">
                <button type="button" className="btn btn-sm btn-outline-dark me-2" onClick={() => onEditProfile(p)}>
                  Edit Profil
                </button>
                <button type="button" className="btn btn-sm btn-dark" onClick={() => onEditStatus(p)}>
                  Edit Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableUserList.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onEditProfile: PropTypes.func.isRequired,
  onEditStatus: PropTypes.func.isRequired,
};

TableUserList.defaultProps = {
  rows: [],
  loading: false,
};

export default TableUserList;
