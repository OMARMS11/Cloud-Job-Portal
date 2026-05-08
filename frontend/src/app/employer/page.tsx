'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { applicationAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import styles from '../applications/applications.module.css';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  appliedAt: string;
}

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Note: This endpoint would need to be created in the backend
    // For now, we're using the getMyApplications as a placeholder
    // In production, create a separate endpoint for employers to get applications for their jobs
    const fetchApplications = async () => {
      try {
        // This is a placeholder - the actual implementation would get applications for employer's jobs
        const response = await applicationAPI.getMyApplications();
        setApplications(response.data);
      } catch (err: any) {
        setError('Failed to fetch applications');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'EMPLOYER') {
      fetchApplications();
    }
  }, [user]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus as any }
            : app
        )
      );
      alert('Application status updated');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredApplications =
    filter === 'ALL'
      ? applications
      : applications.filter((app) => app.status === filter);

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
    <ProtectedRoute requiredRole="EMPLOYER">
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Received Applications</h1>
              <p className={styles.subtext}>Review and manage applications for your job postings</p>
            </div>
            <Link href="/jobs" className={styles.backBtn}>
              Back to Jobs
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {isLoading ? (
            <div className={styles.loading}>Loading applications...</div>
          ) : (
            <>
              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      background: filter === status ? '#667eea' : '#f0f0f0',
                      color: filter === status ? 'white' : '#333',
                      transition: 'all 0.3s',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {filteredApplications.length === 0 ? (
                <div className={styles.noApplications}>
                  <p>No applications found with the selected filter.</p>
                </div>
              ) : (
                <div className={styles.applicationsList}>
                  {filteredApplications.map((app) => (
                    <div key={app.id} className={styles.applicationCard}>
                      <div className={styles.appHeader}>
                        <div>
                          <h3>{app.jobTitle}</h3>
                          <p className={styles.company}>{app.userName} ({app.userEmail})</p>
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
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
