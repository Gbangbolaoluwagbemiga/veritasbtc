// Dashboard layout: renders children without the shared AnnounceBar + Navbar
// (the dashboard has its own nav). The root layout is NOT applied here
// because Next.js always applies the closest layout — but the root layout
// wraps everything. To exclude the shared nav for /dashboard we control
// visibility in NavbarClient (returns null on /dashboard pathnames).
// This layout just passes children through with dashboard-specific wrappers.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
