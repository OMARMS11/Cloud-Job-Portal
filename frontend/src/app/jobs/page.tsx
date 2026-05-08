'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import styles from './jobs.module.css';

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.getJobs();
        setJobs(response.data);
      } catch (err: any) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Browse Jobs</h1>
            {isAuthenticated && user?.role === 'EMPLOYER' && (
              <p className={styles.subtext}>Manage your job postings</p>
            )}
          </div>
          {isAuthenticated && user?.role === 'EMPLOYER' && (
            <Link href="/jobs/create" className={styles.createBtn}>
              Post New Job
            </Link>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading ? (
          <div className={styles.loading}>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className={styles.noJobs}>No jobs available at the moment.</div>
        ) : (
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div>
                      <h3>{job.title}</h3>
                      <p className={styles.company}>{job.company} • {job.location}</p>
                    </div>
                    <span className={styles.salary}>{job.salary}</span>
                  </div>
                  <p className={styles.description}>{job.description.substring(0, 150)}...</p>
                  <div className={styles.footer}>
                    <span className={styles.date}>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
