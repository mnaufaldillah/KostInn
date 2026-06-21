import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

const empty = {
  role: 'Pencari Kost',
  fullname: '',
  email: '',
  contactphone: '',
  address: '',
  password: '',
  confirm: '',
  agree: false,
};

const inputClass = (hasError) => `form-control ki-input${hasError ? ' is-error' : ''}`;
const roleClass = (value, current) => `btn ki-role-btn${value === current ? ' is-active' : ''}`;

function FormRegister() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullname.trim()) e.fullname = 'Nama Lengkap tidak boleh kosong!';
    if (!form.email.trim()) e.email = 'Email tidak boleh kosong!';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid!';
    if (!form.contactphone.trim()) e.contactphone = 'Nomor Telepon tidak boleh kosong!';
    if (!form.address.trim()) e.address = 'Alamat tidak boleh kosong!';
    if (!form.password) e.password = 'Password tidak boleh kosong!';
    else if (form.password.length < 8) e.password = 'Password minimal 8 karakter!';
    if (!form.confirm) e.confirm = 'Konfirmasi password tidak boleh kosong!';
    else if (form.confirm !== form.password) e.confirm = 'Password tidak cocok!';
    if (!form.agree) e.agree = 'Anda harus menyetujui Syarat dan Ketentuan!';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      await axiosInstance.post('/register', {
        email: form.email,
        password: form.password,
        fullname: form.fullname,
        contactphone: form.contactphone,
        address: form.address,
        role: form.role,
      });
      await Swal.fire({ icon: 'success', title: 'Pendaftaran berhasil', text: 'Kode OTP telah dikirim ke email Anda.', confirmButtonColor: '#000000' });
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal mendaftar', text: err.response?.data?.message || 'Terjadi kesalahan', confirmButtonColor: '#000000' });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Daftar Sebagai */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="role">Daftar Sebagai</label>
        <div className="ki-role-group">
          <button type="button" className={roleClass('Pencari Kost', form.role)} onClick={() => setForm((f) => ({ ...f, role: 'Pencari Kost' }))}>Pencari Kost</button>
          <button type="button" className={roleClass('Penyewa Kost', form.role)} onClick={() => setForm((f) => ({ ...f, role: 'Penyewa Kost' }))}>Penyewa Kost</button>
        </div>
      </div>

      {/* Nama Lengkap */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="fullname">Nama Lengkap</label>
        <input id="fullname" name="fullname" value={form.fullname} onChange={set} className={inputClass(errors.fullname)} placeholder="Masukkan Nama Lengkap" />
        {errors.fullname && <small className="ki-error">{errors.fullname}</small>}
      </div>

      {/* Email + Nomor Telepon */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="ki-field">
            <label className="form-label ki-label" htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={set} className={inputClass(errors.email)} placeholder="Masukkan Email" />
            {errors.email && <small className="ki-error">{errors.email}</small>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="ki-field">
            <label className="form-label ki-label" htmlFor="contactphone">Nomor Telepon</label>
            <input id="contactphone" name="contactphone" value={form.contactphone} onChange={set} className={inputClass(errors.contactphone)} placeholder="Masukkan Nomor Telepon" />
            {errors.contactphone && <small className="ki-error">{errors.contactphone}</small>}
          </div>
        </div>
      </div>

      {/* Alamat */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="address">Alamat Lengkap</label>
        <textarea id="address" name="address" value={form.address} onChange={set} rows={3} className={inputClass(errors.address)} placeholder="Masukkan Alamat Lengkap" />
        {errors.address && <small className="ki-error">{errors.address}</small>}
      </div>

      {/* Password */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="password">Password</label>
        <input id="password" type="password" name="password" value={form.password} onChange={set} className={inputClass(errors.password)} placeholder="Minimal 8 Karakter" />
        {errors.password && <small className="ki-error">{errors.password}</small>}
      </div>

      {/* Konfirmasi Password */}
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="confirm">Konfirmasi Password</label>
        <input id="confirm" type="password" name="confirm" value={form.confirm} onChange={set} className={inputClass(errors.confirm)} placeholder="Masukkan ulang Password" />
        {errors.confirm && <small className="ki-error">{errors.confirm}</small>}
      </div>

      {/* Terms */}
      <div className="form-check ki-field">
        <input className="form-check-input ki-terms" type="checkbox" name="agree" checked={form.agree} onChange={set} id="agree" />
        <label className="form-check-label" htmlFor="agree">Saya setuju dengan Syarat dan Ketentuan serta Kebijakan Privasi</label>
      </div>
      {errors.agree && <small className="ki-error d-block mb-2">{errors.agree}</small>}

      <button type="submit" className="btn btn-dark w-100 fw-bold">Daftar</button>

      <p className="text-center mt-3 mb-0">
        Sudah punya akun? <Link to="/login" className="text-decoration-underline">Masuk di Sini!</Link>
      </p>
    </form>
  );
}

export default FormRegister;
