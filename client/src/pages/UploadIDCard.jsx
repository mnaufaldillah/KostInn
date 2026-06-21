import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axiosinstance.js';
import FormUploadIDCard from '../components/form/FormUploadIDCard.jsx';

function UploadIDCard() {
  const [existingUrl, setExistingUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/id-card')
      .then(({ data }) => setExistingUrl(data.IDCardUrl || ''))
      .catch(() => setExistingUrl(''))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ki-register-layout">
      <div className="ki-register-left" />
      <div className="ki-register-right">
        <div className="ki-register-card">
          <h1 className="fw-bold mb-1">Unggah KTP</h1>
          <p className="text-secondary mb-4">Unggah foto KTP Anda untuk verifikasi akun</p>

          {loading ? (
            <p className="text-secondary">Memuat...</p>
          ) : existingUrl ? (
            <div className="text-center">
              <p className="text-secondary">KTP Anda sudah terverifikasi sebelumnya.</p>
              <Link to="/" className="btn btn-dark w-100 fw-bold">Lanjut ke Beranda</Link>
            </div>
          ) : (
            <FormUploadIDCard />
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadIDCard;
