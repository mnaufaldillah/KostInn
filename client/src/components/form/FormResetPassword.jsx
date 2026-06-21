import { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../config/axiosinstance.js';

const inputClass = (hasError) => `form-control ki-input${hasError ? ' is-error' : ''}`;

function FormResetPassword({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email tidak boleh kosong!');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Format email tidak valid!');
    setError('');

    try {
      await axiosInstance.post('/request-reset', { email });
      onSuccess(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="ki-field">
        <label className="form-label ki-label" htmlFor="reset-email">Email</label>
        <input
          id="reset-email"
          className={inputClass(!!error)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan Email"
        />
        {error && <small className="ki-error">{error}</small>}
      </div>

      <button type="submit" className="btn btn-dark w-100 fw-bold">Kirim Link Reset</button>
    </form>
  );
}

FormResetPassword.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default FormResetPassword;
