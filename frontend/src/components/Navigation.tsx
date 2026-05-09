'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return <nav className={styles.nav}></nav>;
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Job Portal
        </Link>

        <div className={styles.navLinks}>
          <Link href="/jobs">Browse Jobs</Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'EMPLOYER' && (
                <>
                  <Link href="/jobs/create">Post Job</Link>
                  <Link href="/employer">Dashboard</Link>
                </>
              )}
              {user?.role === 'JOB_SEEKER' && (
                <Link href="/applications">My Applications</Link>
              )}
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout ({user?.fullName})
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register" className={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
