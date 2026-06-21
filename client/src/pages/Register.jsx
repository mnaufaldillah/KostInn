import FormRegister from '../components/form/FormRegister.jsx';

function Register() {
  return (
    <div className="ki-register-layout">
      <div className="ki-register-left" />
      <div className="ki-register-right">
        <div className="ki-register-card">
          <h1 className="fw-bold mb-1">Buat Akun</h1>
          <p className="text-secondary mb-4">Daftar untuk memulai mencari atau menyewa kost</p>
          <FormRegister />
        </div>
      </div>
    </div>
  );
}

export default Register;
