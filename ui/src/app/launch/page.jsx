import PageHeader from '../../components/ui/PageHeader';
import LaunchJobForm from '../../components/jobs/LaunchJobForm';

export default function LaunchPage() {
  return (
    <>
      <PageHeader
        title="Initiate Verification"
      />
      <div className="max-w-xl">
        <LaunchJobForm />
      </div>
    </>
  );
}
