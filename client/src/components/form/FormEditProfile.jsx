import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

function FormEditProfile({ profile, onDone }) {
  const [form, setForm] = useState({
    fullname: profile.fullname || '',
    contactPhone: profile.contactPhone || '',
    address: profile.address || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      fullname: profile.fullname || '',
      contactPhone: profile.contactPhone || '',
      address: profile.address || '',
    });
  }, [profile]);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/users/${profile.id}`, form);
      await Swal.fire({ icon: 'success', title: 'Profil pengguna diperbarui', confirmButtonColor: '#000000' });
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
        <label className="ki-profile-label" htmlFor="ed-fullname">NAMA LENGKAP</label>
        <input id="ed-fullname" name="fullname" className="form-control ki-input" value={form.fullname} onChange={set} />
      </div>
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="ed-phone">NOMOR TELEPON</label>
        <input id="ed-phone" name="contactPhone" className="form-control ki-input" value={form.contactPhone} onChange={set} />
      </div>
      <div className="ki-profile-field">
        <label className="ki-profile-label" htmlFor="ed-address">ALAMAT LENGKAP</label>
        <textarea id="ed-address" name="address" rows={2} className="form-control ki-input" value={form.address} onChange={set} />
      </div>
      <button type="submit" className="btn btn-dark fw-bold" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
      <button type="button" className="btn btn-link text-decoration-none ms-2" onClick={onDone}>Batal</button>
    </form>
  );
}

FormEditProfile.propTypes = {
  profile: PropTypes.shape({ id: PropTypes.number, fullname: PropTypes.string, contactPhone: PropTypes.string, address: PropTypes.string }).isRequired,
  onDone: PropTypes.func.isRequired,
};

export default FormEditProfile;
