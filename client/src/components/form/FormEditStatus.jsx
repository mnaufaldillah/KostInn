import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

const STATUSES = ['pending', 'active', 'occupied'];

function FormEditStatus({ profile, onDone }) {
  const [status, setStatus] = useState(profile.status || 'pending');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.patch(`/users/${profile.id}/status`, { status });
      await Swal.fire({ icon: 'success', title: 'Status diperbarui', confirmButtonColor: '#000000' });
      onDone();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan', confirmButtonColor: '#000000' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="ki-profile-form">
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="ed-status">STATUS AKUN</label>
        <select id="ed-status" className="form-control ki-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn-dark fw-bold" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
      <button type="button" className="btn btn-link text-decoration-none ms-2" onClick={onDone}>Batal</button>
    </form>
  );
}

FormEditStatus.propTypes = {
  profile: PropTypes.shape({ id: PropTypes.number, status: PropTypes.string }).isRequired,
  onDone: PropTypes.func.isRequired,
};

export default FormEditStatus;
