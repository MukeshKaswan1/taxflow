import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppShell({ children }) {
  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <MobileNav />
        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
