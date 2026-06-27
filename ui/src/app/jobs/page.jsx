'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchJobs } from '../../lib/api';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import JobListItem from '../../components/jobs/JobListItem';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../context/AuthContext';

export default function JobsPageClient() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const jobsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (authLoading) return;
    fetchJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, [authLoading]);

  if (authLoading || loading) {
    return <p className="text-slate-500">Loading jobs...</p>;
  }

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    const panMatches = query
      ? ((job.originalPan && job.originalPan.toLowerCase().includes(query)) ||
         (job.maskedPan && job.maskedPan.toLowerCase().includes(query)))
      : true;

    const statusMatches = statusFilter === 'All' || job.status === statusFilter;
    return panMatches && statusMatches;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <>
      <PageHeader
        title={isAdmin ? 'All Verification Runs' : 'My Runs'}
        description={`${jobs.length} verification run${jobs.length === 1 ? '' : 's'}${isAdmin ? ' in the system' : ' initiated by you'}.`}
        action={
          <Link href="/launch">
            <Button>Initiate Verification</Button>
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="No verification runs found"
          description="Initiate a process to see it listed here."
          action={
            <Link href="/launch">
              <Button>Initiate Verification</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search jobs by PAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={['All', 'INIT', 'REGISTERING', 'BASIC_DETAILS', 'CONTACT_DETAILS', 'OTP_GATE', 'CAPTCHA_GATE', 'ACCOUNT_RECOVERY', 'ALREADY_EXISTS', 'SUCCESS', 'FAILED', 'STOPPED']}
              />
            </div>
          </div>
          
          {filteredJobs.length === 0 ? (
            <p className="text-slate-500 p-4 border border-slate-200 rounded-xl bg-white text-center shadow-sm">No jobs found matching your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentJobs.map((job) => (
                <JobListItem key={job._id} job={job} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(startIndex + jobsPerPage, filteredJobs.length)}</span> of <span className="font-semibold text-slate-900">{filteredJobs.length}</span> jobs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
