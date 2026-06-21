import FormLogin from '../components/form/FormLogin.jsx';

function Login() {
  return (
    <div className="ki-register-layout">
      <div className="ki-register-left" />
      <div className="ki-register-right">
        <div className="ki-register-card">
          <h1 className="fw-bold mb-1">Login</h1>
          <p className="text-secondary mb-4">Masuk untuk memulai mencari atau menyewa kost</p>
          <FormLogin />
        </div>
      </div>
    </div>
  );
}

export default Login;
