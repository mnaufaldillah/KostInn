import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

const empty = { email: '', password: '', remember: false };
const inputClass = (hasError) => `form-control ki-input${hasError ? ' is-error' : ''}`;

function FormLogin() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email tidak boleh kosong!';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid!';
    if (!form.password) e.password = 'Password tidak boleh kosong!';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const { data } = await axiosInstance.post('/login', { email: form.email, password: form.password });
      localStorage.setItem('access_token', data.token);
      navigate(data.IDCardUrl ? '/dashboard' : '/upload-id');
    } catch (err) {
      const msg = err.response?.data?.message;
      // ponytail: server returns generic 'Invalid email or password' → show the mock's inline error
      if (/invalid|unauthorized|tidak sesuai/i.test(msg || '')) {
        setErrors({ form: 'Email dan Password tidak sesuai!' });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal masuk', text: msg || 'Terjadi kesalahan', confirmButtonColor: '#000000' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="ki-form-error mb-3">{errors.form}</div>}

      {/* Email */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="email">Email</label>
        <input id="email" name="email" value={form.email} onChange={set} className={inputClass(errors.email)} placeholder="Masukkan Email" />
        {errors.email && <small className="ki-error">{errors.email}</small>}
      </div>

      {/* Password */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="password">Password</label>
        <input id="password" type="password" name="password" value={form.password} onChange={set} className={inputClass(errors.password)} placeholder="Masukkan Password" />
        {errors.password && <small className="ki-error">{errors.password}</small>}
      </div>

      {/* Remember me */}
      <div className="form-check ki-field">
        <input className="form-check-input ki-terms" type="checkbox" name="remember" checked={form.remember} onChange={set} id="remember" />
        <label className="form-check-label" htmlFor="remember">Ingat Saya</label>
      </div>

      <button type="submit" className="btn btn-dark w-100 fw-bold">Login</button>

      <p className="mt-3 mb-1">
        Belum punya akun? <Link to="/register" className="text-decoration-underline">Daftar di Sini</Link>
      </p>
      <p className="mb-0">
        Lupa Password? <Link to="/reset-password" className="text-decoration-underline">Reset Password di Sini!</Link>
      </p>
    </form>
  );
}

export default FormLogin;
