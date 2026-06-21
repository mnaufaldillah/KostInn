import { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosinstance.js';
import TableUserList from '../components/table/TableUserList.jsx';
import FormEditProfile from '../components/form/FormEditProfile.jsx';
import FormEditStatus from '../components/form/FormEditStatus.jsx';

function UserList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { type: 'profile' | 'status', profile }

  const load = () => {
    setLoading(true);
    axiosInstance
      .get('/users')
      .then(({ data }) => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const closeEdit = () => { setEditing(null); load(); };

  return (
    <div>
      <h1 className="fw-bold mb-1">Daftar Pengguna</h1>
      <p className="text-secondary mb-4">Kelola seluruh pengguna terdaftar</p>

      {editing && (
        <div className="ki-edit-panel">
          <h2 className="h5 fw-bold mb-3">
            {editing.type === 'profile' ? 'Edit Profil' : 'Edit Status'} — {editing.profile.fullname || 'Pengguna'}
          </h2>
          {editing.type === 'profile'
            ? <FormEditProfile profile={editing.profile} onDone={closeEdit} />
            : <FormEditStatus profile={editing.profile} onDone={closeEdit} />}
        </div>
      )}

      <TableUserList
        rows={rows}
        loading={loading}
        onEditProfile={(p) => setEditing({ type: 'profile', profile: p })}
        onEditStatus={(p) => setEditing({ type: 'status', profile: p })}
      />
    </div>
  );
}

export default UserList;
