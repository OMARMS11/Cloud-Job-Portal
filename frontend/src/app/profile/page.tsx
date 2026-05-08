'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await userAPI.updateProfile(formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/jobs" className={styles.backLink}>
            ← Back to Jobs
          </Link>

          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {user?.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1>{user?.fullName}</h1>
                <p className={styles.role}>
                  {user?.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                </p>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isLoading ? (
              <div className={styles.loading}>Loading profile...</div>
            ) : isEditing ? (
              <form onSubmit={handleSave}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                </div>

                <div className={styles.buttons}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={styles.saveBtn}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user?.fullName || '',
                        email: user?.email || '',
                      });
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Role:</span>
                    <span>{user?.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Member Since:</span>
                    <span>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className={styles.buttons}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editBtn}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
