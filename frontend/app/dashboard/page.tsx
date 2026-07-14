import type { Metadata } from 'next';
import { GuestDashboardShell } from '@/components/dashboard/guest-dashboard-shell';

export const metadata: Metadata = {
  title: 'Guest Dashboard',
  description: 'A private guest dashboard for managing Arrow Beach Hotel reservations, service requests, and stay preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <GuestDashboardShell />;
}