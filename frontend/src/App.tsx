import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { PageWrapper } from './components/layout/PageWrapper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const Loading = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-surface-50 gap-4">
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-primary animate-pulse">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-sm text-slate-400 font-medium animate-pulse">Loading...</p>
  </div>
);

const Placeholder = ({ title }: { title: string }) => (
  <PageWrapper>
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-500 mt-2">This page is being built.</p>
    </div>
  </PageWrapper>
);

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Dashboard
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Chat
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));
const ConversationPage = lazy(() => import('./pages/chat/ConversationPage'));

// Learn
const CourseCatalogPage = lazy(() => import('./pages/learn/CourseCatalogPage'));
const CourseDetailPage = lazy(() => import('./pages/learn/CourseDetailPage'));
const LessonViewerPage = lazy(() => import('./pages/learn/LessonViewerPage'));

// Teach
const InstructorDashboardPage = lazy(() => import('./pages/teach/InstructorDashboardPage'));
const CreateCoursePage = lazy(() => import('./pages/teach/CreateCoursePage'));
const EditCoursePage = lazy(() => import('./pages/teach/EditCoursePage'));

// Tools
const ToolMarketplacePage = lazy(() => import('./pages/tools/ToolMarketplacePage'));
const ToolRunnerPage = lazy(() => import('./pages/tools/ToolRunnerPage'));
const ToolHistoryPage = lazy(() => import('./pages/tools/ToolHistoryPage'));

// Automations
const WorkflowListPage = lazy(() => import('./pages/automations/WorkflowListPage'));
const WorkflowBuilderPage = lazy(() => import('./pages/automations/WorkflowBuilderPage'));
const RunHistoryPage = lazy(() => import('./pages/automations/RunHistoryPage'));

// Subscription
const PricingPage = lazy(() => import('./pages/PricingPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));

// Profile
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Admin
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const CourseModPage = lazy(() => import('./pages/admin/CourseModPage'));
const ToolManagementPage = lazy(() => import('./pages/admin/ToolManagementPage'));
const PlatformAnalyticsPage = lazy(() => import('./pages/admin/PlatformAnalyticsPage'));

function SafePage({ component: Component, title }: { component: React.LazyExoticComponent<() => JSX.Element>; title: string }) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Suspense fallback={<Loading />}><LoginPage /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<Loading />}><RegisterPage /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<Loading />}><PricingPage /></Suspense>} />

            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<Loading />}><DashboardPage /></Suspense></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Suspense fallback={<Loading />}><ChatPage /></Suspense></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Suspense fallback={<Loading />}><ConversationPage /></Suspense></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><Suspense fallback={<Loading />}><CourseCatalogPage /></Suspense></ProtectedRoute>} />
            <Route path="/learn/:id" element={<ProtectedRoute><Suspense fallback={<Loading />}><CourseDetailPage /></Suspense></ProtectedRoute>} />
            <Route path="/learn/:courseId/lesson/:lessonId" element={<ProtectedRoute><Suspense fallback={<Loading />}><LessonViewerPage /></Suspense></ProtectedRoute>} />
            <Route path="/teach" element={<ProtectedRoute><Suspense fallback={<Loading />}><InstructorDashboardPage /></Suspense></ProtectedRoute>} />
            <Route path="/teach/courses/new" element={<ProtectedRoute><Suspense fallback={<Loading />}><CreateCoursePage /></Suspense></ProtectedRoute>} />
            <Route path="/teach/courses/:id/edit" element={<ProtectedRoute><Suspense fallback={<Loading />}><EditCoursePage /></Suspense></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute><Suspense fallback={<Loading />}><ToolMarketplacePage /></Suspense></ProtectedRoute>} />
            <Route path="/tools/history" element={<ProtectedRoute><Suspense fallback={<Loading />}><ToolHistoryPage /></Suspense></ProtectedRoute>} />
            <Route path="/tools/:slug" element={<ProtectedRoute><Suspense fallback={<Loading />}><ToolRunnerPage /></Suspense></ProtectedRoute>} />
            <Route path="/automations" element={<ProtectedRoute><Suspense fallback={<Loading />}><WorkflowListPage /></Suspense></ProtectedRoute>} />
            <Route path="/automations/new" element={<ProtectedRoute><Suspense fallback={<Loading />}><WorkflowBuilderPage /></Suspense></ProtectedRoute>} />
            <Route path="/automations/:id/edit" element={<ProtectedRoute><Suspense fallback={<Loading />}><WorkflowBuilderPage /></Suspense></ProtectedRoute>} />
            <Route path="/automations/:id/runs" element={<ProtectedRoute><Suspense fallback={<Loading />}><RunHistoryPage /></Suspense></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Suspense fallback={<Loading />}><BillingPage /></Suspense></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<Loading />}><ProfilePage /></Suspense></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<Loading />}><SettingsPage /></Suspense></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><Suspense fallback={<Loading />}><AdminOverviewPage /></Suspense></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><Suspense fallback={<Loading />}><UserManagementPage /></Suspense></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><Suspense fallback={<Loading />}><CourseModPage /></Suspense></AdminRoute>} />
            <Route path="/admin/tools" element={<AdminRoute><Suspense fallback={<Loading />}><ToolManagementPage /></Suspense></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><Suspense fallback={<Loading />}><PlatformAnalyticsPage /></Suspense></AdminRoute>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
