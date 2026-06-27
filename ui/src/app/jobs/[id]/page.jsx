'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchJob } from '../../../lib/api';
import PageHeader from '../../../components/ui/PageHeader';
import JobDetailPanel from '../../../components/jobs/JobDetailPanel';

export default function JobDetailPageClient() {
  const params = useParams();
  const jobId = params.id;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    fetchJob(jobId).then((data) => {
      if (!data) setNotFound(true);
      else setJob(data);
      setLoading(false);
    });
  }, [jobId]);

  if (loading) return <p className="text-slate-500">Loading task...</p>;
  if (notFound) {
    return (
      <div className="space-y-4">
        <p className="text-red-500 font-semibold">Verification task not found or access denied.</p>
        <Link href="/jobs" className="text-blue-600 hover:underline">← Back to Runs</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Verification Task: ${job.maskedPan}`}
        action={
          <Link
            href="/jobs"
            className="font-semibold py-2.5 px-4 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            ← Back to Runs
          </Link>
        }
      />
      <JobDetailPanel job={job} />
    </>
  );
}
