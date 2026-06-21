import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/axiosinstance.js';

const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']);

function FormUploadIDCard({ existingUrl }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(existingUrl || null);
  const [isPdf, setIsPdf] = useState(existingUrl ? /\.pdf$/i.test(existingUrl) : false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFiles = (files) => {
    setError('');
    const f = files?.[0];
    if (!f) return;
    if (!ALLOWED.has(f.type)) {
      setFile(null);
      setPreviewUrl(null);
      setIsPdf(false);
      return setError('Format file tidak didukung. Hanya PNG, JPG, JPEG, atau PDF.');
    }
    setFile(f);
    setIsPdf(f.type === 'application/pdf');
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleNext = async () => {
    if (!file) return setError('Silakan unggah KTP terlebih dahulu.');
    setError('');
    setLoading(true);
    const data = new FormData();
    data.append('IDCard', file);
    try {
      await axiosInstance.post('/id-card', data);
      await Swal.fire({ icon: 'success', title: 'KTP berhasil diunggah', confirmButtonColor: '#000000' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengunggah KTP');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsPdf(false);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {previewUrl ? (
        <div className="ki-id-preview">
          {isPdf ? (
            <div className="ki-id-pdf">
              <span>📄</span> {file?.name || 'ID Card.pdf'}
            </div>
          ) : (
            <img src={previewUrl} alt="Preview KTP" className="ki-id-image" />
          )}
          <div className="d-flex gap-2 mt-3">
            <button type="button" className="btn btn-outline-dark" onClick={reset}>Ganti File</button>
            <button type="button" className="btn btn-dark flex-grow-1" onClick={handleNext} disabled={loading}>
              {loading ? 'Mengunggah...' : 'Lanjut'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <label
            className={`ki-dropzone${error ? ' is-error' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="ki-dropzone-icon">⬆️</div>
            <p className="mb-1 fw-semibold">Seret &amp; lepas atau klik untuk mengunggah</p>
            <small className="text-secondary">PNG, JPG, JPEG, atau PDF (maks 5MB)</small>
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,image/jpg,application/pdf"
              className="ki-file-input"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
          {error && <small className="ki-error d-block mt-2">{error}</small>}
        </>
      )}
    </div>
  );
}

FormUploadIDCard.propTypes = {
  existingUrl: PropTypes.string,
};

FormUploadIDCard.defaultProps = {
  existingUrl: '',
};

export default FormUploadIDCard;
