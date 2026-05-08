'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobAPI, applicationAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import styles from '../jobs.module.css';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  employerId: string;
  createdAt: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { isAuthenticated, user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobAPI.getJobById(jobId);
        setJob(response.data);
      } catch (err: any) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsApplying(true);
    try {
      await applicationAPI.submitApplication({
        jobId,
        userId: user.id,
        coverLetter,
      });
      alert('Application submitted successfully!');
      setCoverLetter('');
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/jobs" className={styles.backLink}>
          ← Back to Jobs
        </Link>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading ? (
          <div className={styles.loading}>Loading job details...</div>
        ) : job ? (
          <div className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <div>
                <h1>{job.title}</h1>
                <p className={styles.company}>{job.company} • {job.location}</p>
                <p className={styles.date}>Posted {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={styles.salary}>{job.salary}</span>
            </div>

            <div className={styles.description}>
              <h2>About this job</h2>
              <p>{job.description}</p>
            </div>

            {isAuthenticated && user?.role === 'JOB_SEEKER' && user.id !== job.employerId && (
              <div className={styles.applySection}>
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className={styles.applyBtn}
                  >
                    Apply Now
                  </button>
                ) : (
                  <form onSubmit={handleApply} className={styles.applyForm}>
                    <h3>Apply for this position</h3>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write your cover letter here (optional)"
                      rows={6}
                    />
                    <div className={styles.formButtons}>
                      <button
                        type="submit"
                        disabled={isApplying}
                        className={styles.submitBtn}
                      >
                        {isApplying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setCoverLetter('');
                        }}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className={styles.loginPrompt}>
                <p>Please <Link href="/auth/login">login</Link> to apply for this job.</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noJobs}>Job not found</div>
        )}
      </div>
    </main>
  );
}
