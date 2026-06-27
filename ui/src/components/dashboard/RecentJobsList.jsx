import Link from 'next/link';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import JobStatusBadge from '../jobs/JobStatusBadge';
import { formatJobDate } from '../../lib/jobs';

export default function RecentJobsList({ jobs }) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No verification runs yet"
        description="Initiate your first verification process to get started."
        action={
          <Link href="/launch">
            <Button>Initiate Verification</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Card className="p-6 bg-white border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Recent Runs</h2>
        <Link href="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <th className="pb-3 font-semibold">Task ID</th>
              <th className="pb-3 font-semibold">PAN</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Updated</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 pr-4">
                  <p className="text-xs text-slate-500 font-mono truncate max-w-[120px]">{job._id}</p>
                </td>
                <td className="py-4 pr-4">
                  <p className="text-sm font-semibold text-slate-700">{job.maskedPan}</p>
                </td>
                <td className="py-4 pr-4">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="py-4 pr-4">
                  <p className="text-xs text-slate-500" suppressHydrationWarning>{formatJobDate(job.updatedAt)}</p>
                </td>
                <td className="py-4 text-right">
                  <Link href={`/jobs/${job._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
