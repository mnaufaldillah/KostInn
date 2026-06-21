import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

const inputClass = (hasError) => `form-control ki-input${hasError ? ' is-error' : ''}`;

function FormSetPassword({ token }) {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.password) e.password = 'Password tidak boleh kosong!';
    else if (form.password.length < 8) e.password = 'Password minimal 8 karakter!';
    if (!form.confirm) e.confirm = 'Konfirmasi password tidak boleh kosong!';
    else if (form.confirm !== form.password) e.confirm = 'Password tidak cocok!';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      await axiosInstance.post('/reset-password', { token, password: form.password });
      await Swal.fire({ icon: 'success', title: 'Password berhasil diubah', text: 'Silakan masuk dengan password baru Anda.', confirmButtonColor: '#000000' });
      window.location.href = '/login';
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Tautan tidak valid atau telah kedaluwarsa', confirmButtonColor: '#000000' });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="password">Password Baru</label>
        <input id="password" type="password" name="password" value={form.password} onChange={set} className={inputClass(!!errors.password)} placeholder="Minimal 8 Karakter" />
        {errors.password && <small className="ki-error">{errors.password}</small>}
      </div>

      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="confirm">Konfirmasi Password</label>
        <input id="confirm" type="password" name="confirm" value={form.confirm} onChange={set} className={inputClass(!!errors.confirm)} placeholder="Masukkan ulang Password" />
        {errors.confirm && <small className="ki-error">{errors.confirm}</small>}
      </div>

      <button type="submit" className="btn btn-dark w-100 fw-bold">Simpan Password Baru</button>
    </form>
  );
}

FormSetPassword.propTypes = {
  token: PropTypes.string.isRequired,
};

export default FormSetPassword;
