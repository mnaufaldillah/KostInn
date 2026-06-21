import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <section className="ki-hero">
      <h1 className="ki-hero-brand">KOST.INN</h1>
      <p className="ki-hero-sub">PPS - Muhammad Naufaldillah - 6026252010</p>
      <div className="ki-hero-actions">
        <Link className="btn btn-outline-dark btn-lg" to="/login">Login</Link>
        <Link className="btn btn-dark btn-lg" to="/register">Daftar</Link>
      </div>
    </section>
  );
}

export default Homepage;
