'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import styles from '../jobs.module.css';

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await jobAPI.createJob(formData);
      alert('Job posted successfully!');
      router.push('/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="EMPLOYER">
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/jobs" className={styles.backLink}>
            ← Back to Jobs
          </Link>

          <div className={styles.detailCard}>
            <h1>Post a New Job</h1>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Job Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company">Company Name *</label>
                <input
                  id="company"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g., TechCorp Inc."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote, San Francisco, CA"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="salary">Salary Range *</label>
                <input
                  id="salary"
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $120k - $150k"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed job description, responsibilities, requirements..."
                  rows={8}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formButtons}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitBtn}
                >
                  {isLoading ? 'Posting...' : 'Post Job'}
                </button>
                <Link href="/jobs" className={styles.cancelBtn}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
