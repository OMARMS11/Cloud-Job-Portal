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
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    console.log('Auth loading:', authLoading);
    console.log('User data:', user);
    
    if (!authLoading) {
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
        });
        setIsLoading(false);
      } else {
        // No user, redirect to login
        console.log('No user found, redirecting to login');
        router.push('/auth/login');
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      console.log('Updating profile with:', formData);
      await userAPI.updateProfile(formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
      // Optionally refresh user data
      window.location.reload();
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading profile...
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              Error: Unable to load user profile. Please try logging in again.
            </div>
            <button onClick={() => router.push('/auth/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

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
                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <h1>{user?.fullName || 'User'}</h1>
                <p className={styles.role}>
                  {user?.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                </p>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isEditing ? (
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