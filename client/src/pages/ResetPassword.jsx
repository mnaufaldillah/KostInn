import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormResetPassword from '../components/form/FormResetPassword.jsx';

function ResetPassword() {
  const [sentTo, setSentTo] = useState(null);

  return (
    <div className="ki-register-layout">
      <div className="ki-register-left" />
      <div className="ki-register-right">
        <div className="ki-register-card">
          {sentTo ? (
            <>
              <h1 className="fw-bold mb-1">Cek Email Anda</h1>
              <p className="text-secondary mb-4">
                Tautan reset password telah dikirim ke <strong>{sentTo}</strong>. Silakan periksa email Anda untuk mengatur ulang password.
              </p>
              <Link to="/login" className="btn btn-outline-dark w-100 fw-bold">Kembali ke Login</Link>
            </>
          ) : (
            <>
              <h1 className="fw-bold mb-1">Lupa Password</h1>
              <p className="text-secondary mb-4">Masukkan email Anda untuk menerima tautan reset password</p>
              <FormResetPassword onSuccess={setSentTo} />
              <p className="mt-3 mb-0">
                Ingat password Anda? <Link to="/login" className="text-decoration-underline">Masuk di Sini</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
