import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AISkillMapping from './pages/AISkillMapping';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectionModal from './components/RoleSelectionModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserProfile } from './hooks/useUserProfile';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => <Outlet />
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

const industryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry-dashboard',
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

const aiSkillRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-skill-mapping',
  component: AISkillMapping
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  studentRoute,
  industryRoute,
  adminRoute,
  aiSkillRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <RoleSelectionModal />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
