import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AISkillMapping from './pages/AISkillMapping';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectionModal from './components/RoleSelectionModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserProfile } from './hooks/useUserProfile';
import { Toaster } from './components/ui/sonner';

// Lazy load page components
const MyProjects = lazy(() => import('./pages/MyProjects'));
const SkillProfile = lazy(() => import('./pages/SkillProfile'));
const Mentorship = lazy(() => import('./pages/Mentorship'));
const StudentSettings = lazy(() => import('./pages/StudentSettings'));
const Applicants = lazy(() => import('./pages/Applicants'));
const IndustryAnalytics = lazy(() => import('./pages/IndustryAnalytics'));
const IndustrySettings = lazy(() => import('./pages/IndustrySettings'));
const Users = lazy(() => import('./pages/Users'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const Revenue = lazy(() => import('./pages/Revenue'));
const Reports = lazy(() => import('./pages/Reports'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

const queryClient = new QueryClient();

// Layout component that includes the role selection modal
function RootLayout() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleRoleComplete = (dashboardPath: string) => {
    // Navigate to the dashboard after role selection
    navigate({ to: dashboardPath as any });
  };

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-background dark flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
        <Outlet />
      </Suspense>
      <Toaster />
      {showProfileSetup && <RoleSelectionModal onComplete={handleRoleComplete} />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student-dashboard',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
});

const studentMyProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/my-projects',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
});

const studentSkillProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/skill-profile',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
});

const studentMentorshipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/mentorship',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
});

const studentSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/settings',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
});

const industryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry-dashboard',
  component: () => (
    <ProtectedRoute requiredRole="industryPartner">
      <IndustryDashboard />
    </ProtectedRoute>
  )
});

const industryPostProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry/post-project',
  component: () => (
    <ProtectedRoute requiredRole="industryPartner">
      <IndustryDashboard />
    </ProtectedRoute>
  )
});

const industryApplicantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry/applicants',
  component: () => (
    <ProtectedRoute requiredRole="industryPartner">
      <IndustryDashboard />
    </ProtectedRoute>
  )
});

const industryAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry/analytics',
  component: () => (
    <ProtectedRoute requiredRole="industryPartner">
      <IndustryDashboard />
    </ProtectedRoute>
  )
});

const industrySettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry/settings',
  component: () => (
    <ProtectedRoute requiredRole="industryPartner">
      <IndustryDashboard />
    </ProtectedRoute>
  )
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const adminProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/projects',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const adminRevenueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/revenue',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const adminReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/reports',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
});

const aiSkillRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-skill-mapping',
  component: AISkillMapping
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  studentRoute,
  studentMyProjectsRoute,
  studentSkillProfileRoute,
  studentMentorshipRoute,
  studentSettingsRoute,
  industryRoute,
  industryPostProjectRoute,
  industryApplicantsRoute,
  industryAnalyticsRoute,
  industrySettingsRoute,
  adminRoute,
  adminUsersRoute,
  adminProjectsRoute,
  adminRevenueRoute,
  adminReportsRoute,
  adminSettingsRoute,
  aiSkillRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
