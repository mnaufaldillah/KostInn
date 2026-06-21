import { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosinstance.js';
import FormProfile from '../components/form/FormProfile.jsx';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axiosInstance
      .get('/me')
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading || !profile) return <p className="text-secondary">Memuat profil...</p>;

  return (
    <div className="ki-profile">
      <header className="ki-profile-header">
        <div className="ki-profile-avatar" aria-hidden="true">{(profile.fullname || '?').charAt(0).toUpperCase()}</div>
        <div className="ki-profile-meta">
          <h1 className="fw-bold mb-0">{profile.fullname || 'Tanpa Nama'}</h1>
          <p className="text-secondary mb-0">Status: {profile.role}</p>
        </div>
      </header>

      <FormProfile profile={profile} onUpdated={setProfile} />
    </div>
  );
}

export default Profile;
