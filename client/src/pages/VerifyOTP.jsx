import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../config/axiosinstance.js';
import CardOTP from '../components/form/CardOTP.jsx';

function VerifyOTP() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || '');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email tidak boleh kosong!';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Format email tidak valid!';
    if (code.replace(/\s/g, '').length !== 6) e.code = 'Kode OTP 6 digit tidak boleh kosong!';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const { data } = await axiosInstance.post('/verify-otp', { email, otp: code.replace(/\s/g, '') });
      localStorage.setItem('access_token', data.token);
      await Swal.fire({ icon: 'success', title: 'Verifikasi berhasil', text: 'Akun Anda telah aktif.', confirmButtonColor: '#000000' });
      navigate(data.IDCardUrl ? '/dashboard' : '/upload-id');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan';
      if (/invalid|wrong|tidak|expired|expir/i.test(msg)) {
        setErrors({ code: msg });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal verifikasi', text: msg, confirmButtonColor: '#000000' });
      }
    }
  };

  return (
    <div className="ki-auth-page">
      <form onSubmit={handleSubmit} noValidate className="ki-auth-card">
        <h1 className="fw-bold text-center mb-1">Verifikasi OTP</h1>
        <p className="text-secondary text-center mb-4">Masukkan kode 6 digit yang dikirim ke email Anda</p>

        <div className="mb-3">
          <label className="form-label ki-label" htmlFor="email">Email</label>
          <input
            id="email"
            className={`form-control ki-input${errors.email ? ' is-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan Email"
          />
          {errors.email && <small className="ki-error">{errors.email}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label ki-label" htmlFor="otp-code">Kode OTP</label>
          <CardOTP id="otp-code" value={code} onChange={setCode} error={!!errors.code} />
          {errors.code && <small className="ki-error mt-2 d-block">{errors.code}</small>}
        </div>

        <button type="submit" className="btn btn-dark w-100 fw-bold">Verifikasi</button>
      </form>
    </div>
  );
}

export default VerifyOTP;
