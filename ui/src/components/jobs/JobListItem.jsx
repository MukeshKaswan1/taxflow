import Link from 'next/link';
import Card from '../ui/Card';
import JobStatusBadge from './JobStatusBadge';
import { formatJobDate, isActiveStatus } from '../../lib/jobs';

export default function JobListItem({ job }) {
  const active = isActiveStatus(job.status);

  return (
    <Link href={`/jobs/${job._id}`}>
      <Card className={`p-4 hover:bg-slate-50 transition-colors group ${active ? 'border-blue-500/40 bg-blue-50/5' : ''}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-semibold text-slate-800">PAN: {job.maskedPan}</p>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">{job._id}</p>
            <p className="text-xs text-slate-500 mt-1" suppressHydrationWarning>Updated {formatJobDate(job.updatedAt)}</p>
          </div>
          <span className="text-slate-400 group-hover:text-blue-600 transition-colors text-sm">→</span>
        </div>
      </Card>
    </Link>
  );
}
