'use client';

import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import JobStatusBadge from './JobStatusBadge';
import JobConsole from './JobConsole';
import OtpInputForm from './OtpInputForm';
import StopJobControl from './StopJobControl';
import RestartJobControl from './RestartJobControl';
import CorrectionForm from './CorrectionForm';
import RecoveredPasswordCard from './RecoveredPasswordCard';
import AdminJobEditPanel from './AdminJobEditPanel';
import { formatJobDate, TERMINAL_STATUSES } from '../../lib/jobs';
import { useJobStatus } from '../../hooks/useJobStatus';
import { useAuth } from '../../context/AuthContext';

const INPUT_PHASES = ['OTP_GATE', 'CAPTCHA_GATE'];
const AADHAAR_OTP_OPTIONS = ['I already have an OTP', 'Generate OTP'];

const isAadhaarOtpCorrectionLog = (log) =>
  log?.phase === 'CORRECTION_GATE' &&
  /Aadhaar OTP|generate a new OTP|use an existing one/i.test(log.message || '');

export default function JobDetailPanel({ job: initialJob }) {
  const [stopped, setStopped] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(initialJob.status === 'SUCCESS');
  const { isAdmin } = useAuth();
  const { status, logs, error, isTerminal, lastOtpError, correctionMessage, correctionField, correctionOptions, recoveredPassword } = useJobStatus(initialJob._id, initialJob.status, initialJob);

  useEffect(() => {
    if (status === 'SUCCESS') {
      setShowSuccessModal(true);
    }
  }, [status]);

  const needsInput = INPUT_PHASES.includes(status) && !isTerminal && !stopped;
  const latestOtpPrompt = logs.filter((l) => INPUT_PHASES.includes(l.phase)).at(-1);
  const latestCorrectionLog = logs.filter((l) => l.phase === 'CORRECTION_GATE').at(-1);
  const isAadhaarOtpGate =
    correctionField === 'aadhaarOtpChoice' ||
    (status === 'CORRECTION_GATE' && isAadhaarOtpCorrectionLog(latestCorrectionLog));
  const effectiveCorrectionField = isAadhaarOtpGate
    ? 'aadhaarOtpChoice'
    : (correctionField || 'registrationDetails');
  const effectiveCorrectionOptions = isAadhaarOtpGate
    ? ((correctionOptions?.length >= 2) ? correctionOptions : AADHAAR_OTP_OPTIONS)
    : correctionOptions;
  const effectiveCorrectionMessage = isAadhaarOtpGate
    ? (correctionMessage || latestCorrectionLog?.message || 'Aadhaar OTP required. Do you want to generate a new OTP or use an existing one?')
    : correctionMessage;
  const hasPassword = isAdmin && !!(initialJob.hasPassword);
  const showAdminEdit = isAdmin && TERMINAL_STATUSES.includes(status);

  return (
    <div className="space-y-6">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center relative border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-200">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ITR Credentials Created!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed text-sm">
              The automation completed successfully. You can now log into the portal using the PAN and the generated password!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Awesome, thanks!
            </button>
          </div>
        </div>
      )}
      {needsInput && (
        <Card className="p-5 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-amber-800">
                {status === 'CAPTCHA_GATE' ? 'CAPTCHA Required' : 'OTP Required — Action Needed'}
              </h3>
              <p className="text-sm text-amber-700">
                The portal is waiting for {status === 'CAPTCHA_GATE' ? 'a CAPTCHA' : 'an OTP'}. Enter it below.
              </p>
            </div>
          </div>
          <OtpInputForm
            key={latestOtpPrompt?.seq ?? status}
            jobId={initialJob._id}
            status={status}
            logs={logs}
            lastOtpError={lastOtpError}
          />
        </Card>
      )}

      {status === 'CORRECTION_GATE' && !isTerminal && !stopped && (
        <Card className={`p-5 ${isAadhaarOtpGate ? 'border-blue-200 bg-blue-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{isAadhaarOtpGate ? '🔑' : '⚠️'}</span>
            <div>
              <h3 className={`text-lg font-bold ${isAadhaarOtpGate ? 'text-blue-800' : 'text-amber-800'}`}>
                {isAadhaarOtpGate ? 'Action Required — Account Recovery' : 'Correction Required'}
              </h3>
              <p className={`text-sm ${isAadhaarOtpGate ? 'text-blue-700' : 'text-amber-700'}`}>
                {effectiveCorrectionMessage || (isAadhaarOtpGate ? 'Please select how to proceed with Aadhaar OTP.' : 'The portal rejected some registration details. Please correct them and resume.')}
              </p>
            </div>
          </div>
          <CorrectionForm
            key={effectiveCorrectionField}
            jobId={initialJob._id}
            initialPayload={initialJob.registrationPayload}
            correctionMessage={effectiveCorrectionMessage}
            correctionField={effectiveCorrectionField}
            correctionOptions={effectiveCorrectionOptions}
          />
        </Card>
      )}

      {hasPassword && (
        <RecoveredPasswordCard jobId={initialJob._id} hasPassword={hasPassword} />
      )}

      {showAdminEdit && (
        <AdminJobEditPanel
          jobId={initialJob._id}
          registrationPayload={initialJob.registrationPayload}
          outcomeMessage={initialJob.outcomeMessage}
        />
      )}

      <Card className="p-6 bg-white border border-slate-200">
        {!isTerminal && !stopped && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 opacity-70 animate-pulse" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-1">JOB ID</p>
            <p className="text-sm text-slate-600 font-mono break-all">{initialJob._id}</p>
            <p className="text-lg text-slate-800 font-bold mt-2">PAN: {initialJob.maskedPan}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium" suppressHydrationWarning>Created {formatJobDate(initialJob.createdAt)}</p>
            <p className="text-xs text-slate-400 font-medium" suppressHydrationWarning>Updated {formatJobDate(initialJob.updatedAt)}</p>
            {initialJob.createdByName && (
              <p className="text-xs text-slate-400 font-medium">Launched by {initialJob.createdByName}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <JobStatusBadge status={status} stopped={stopped} />
            {(!isTerminal && !stopped) ? (
              <StopJobControl jobId={initialJob._id} onStopped={() => setStopped(true)} />
            ) : (
              <RestartJobControl jobId={initialJob._id} />
            )}
          </div>
        </div>

        {initialJob.registrationPayload && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div><span className="text-slate-400 font-medium">Category</span><p className="text-slate-700 font-semibold">{initialJob.registrationPayload.category || '—'}</p></div>
            <div><span className="text-slate-400 font-medium">Type</span><p className="text-slate-700 font-semibold">{initialJob.registrationPayload.isOthers ? 'Others' : 'Taxpayer'}</p></div>
            <div><span className="text-slate-400 font-medium">PID</span><p className="text-slate-700 font-mono font-semibold">{initialJob.pid || '—'}</p></div>
          </div>
        )}

        <h3 className="text-sm font-bold text-slate-700 mb-3">Live Console</h3>
        <JobConsole jobId={initialJob._id} logs={logs} error={error} stopped={stopped} />

        {initialJob.outcomeMessage && !hasPassword && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600 font-medium">
            {initialJob.outcomeMessage}
          </div>
        )}
      </Card>
    </div>
  );
}
