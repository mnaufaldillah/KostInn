import { Link, useSearchParams } from 'react-router-dom';
import FormSetPassword from '../components/form/FormSetPassword.jsx';

function SetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');

  return (
    <div className="ki-register-layout">
      <div className="ki-register-left" />
      <div className="ki-register-right">
        <div className="ki-register-card">
          {token ? (
            <>
              <h1 className="fw-bold mb-1">Atur Ulang Password</h1>
              <p className="text-secondary mb-4">Masukkan password baru untuk akun Anda</p>
              <FormSetPassword token={token} />
            </>
          ) : (
            <>
              <h1 className="fw-bold mb-1">Tautan Tidak Valid</h1>
              <p className="text-secondary mb-4">Tautan reset password tidak ditemukan atau telah kedaluwarsa.</p>
              <Link to="/reset-password" className="btn btn-dark w-100 fw-bold">Minta Tautan Baru</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
