'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { applicationAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import styles from './applications.module.css';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  appliedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationAPI.getMyApplications();
        setApplications(response.data);
      } catch (err: any) {
        setError('Failed to fetch applications');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'JOB_SEEKER') {
      fetchApplications();
    }
  }, [user]);

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationAPI.deleteApplication(applicationId);
      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationId)
      );
      alert('Application withdrawn successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'REVIEWED':
        return styles.statusReviewed;
      case 'ACCEPTED':
        return styles.statusAccepted;
      case 'REJECTED':
        return styles.statusRejected;
      default:
        return '';
    }
  };

  return (
    <ProtectedRoute requiredRole="JOB_SEEKER">
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>My Applications</h1>
              <p className={styles.subtext}>Track your job applications</p>
            </div>
            <Link href="/jobs" className={styles.backBtn}>
              Browse More Jobs
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {isLoading ? (
            <div className={styles.loading}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className={styles.noApplications}>
              <p>You haven't applied to any jobs yet.</p>
              <Link href="/jobs" className={styles.browseBtn}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className={styles.applicationsList}>
              {applications.map((app) => (
                <div key={app.id} className={styles.applicationCard}>
                  <div className={styles.appHeader}>
                    <div>
                      <h3>{app.jobTitle}</h3>
                      <p className={styles.company}>{app.company}</p>
                    </div>
                    <span className={`${styles.status} ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <div className={styles.coverLetter}>
                      <h4>Cover Letter</h4>
                      <p>{app.coverLetter.substring(0, 200)}...</p>
                    </div>
                  )}

                  <div className={styles.appFooter}>
                    <span className={styles.date}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className={styles.withdrawBtn}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
