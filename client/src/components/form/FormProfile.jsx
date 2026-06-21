import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

function FormProfile({ profile, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullname: profile.fullname || '',
    contactPhone: profile.contactPhone || '',
    address: profile.address || '',
  });
  const [loading, setLoading] = useState(false);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const cancel = () => {
    setForm({
      fullname: profile.fullname || '',
      contactPhone: profile.contactPhone || '',
      address: profile.address || '',
    });
    setEditing(false);
  };

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/me', form);
      await Swal.fire({ icon: 'success', title: 'Profil diperbarui', confirmButtonColor: '#000000' });
      setEditing(false);
      onUpdated(data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal memperbarui', text: err.response?.data?.message || 'Terjadi kesalahan', confirmButtonColor: '#000000' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ki-profile-form">
      {/* NAMA LENGKAP */}
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="fullname">NAMA LENGKAP</label>
        {editing ? (
          <input id="fullname" name="fullname" className="form-control ki-input" value={form.fullname} onChange={set} />
        ) : (
          <p className="ki-profile-value">{profile.fullname || '-'}</p>
        )}
      </div>

      {/* NOMOR TELEPON */}
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="contactPhone">NOMOR TELEPON</label>
        {editing ? (
          <input id="contactPhone" name="contactPhone" className="form-control ki-input" value={form.contactPhone} onChange={set} />
        ) : (
          <p className="ki-profile-value">{profile.contactPhone || '-'}</p>
        )}
      </div>

      {/* EMAIL (always read-only) */}
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="email">EMAIL</label>
        <p className="ki-profile-value">{profile.email || '-'}</p>
      </div>

      {/* ALAMAT LENGKAP */}
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="address">ALAMAT LENGKAP</label>
        {editing ? (
          <textarea id="address" name="address" rows={2} className="form-control ki-input" value={form.address} onChange={set} />
        ) : (
          <p className="ki-profile-value">{profile.address || '-'}</p>
        )}
      </div>

      {editing ? (
        <>
          <button type="button" className="btn btn-dark fw-bold" disabled={loading} onClick={save}>
            {loading ? 'Menyimpan...' : 'Update Profil'}
          </button>
          <button type="button" className="btn btn-link text-decoration-none ms-2" onClick={cancel}>Batal</button>
        </>
      ) : (
        <button type="button" className="btn btn-outline-dark fw-bold" onClick={() => setEditing(true)}>
          Edit Profil
        </button>
      )}
    </div>
  );
}

FormProfile.propTypes = {
  profile: PropTypes.shape({
    fullname: PropTypes.string,
    contactPhone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  onUpdated: PropTypes.func,
};

FormProfile.defaultProps = {
  onUpdated: () => {},
};

export default FormProfile;
