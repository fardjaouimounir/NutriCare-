import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';

// Lazy load pages for performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NutritionPage = React.lazy(() => import('./pages/NutritionPage'));
const RecipesPage = React.lazy(() => import('./pages/RecipesPage'));
const HydrationPage = React.lazy(() => import('./pages/HydrationPage'));
const JournalPage = React.lazy(() => import('./pages/JournalPage'));
const WellnessPage = React.lazy(() => import('./pages/WellnessPage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const AdvicePage = React.lazy(() => import('./pages/AdvicePage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminContentPage = React.lazy(() => import('./pages/admin/AdminContentPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminAnalyticsPage = React.lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminSpecialistsPage = React.lazy(() => import('./pages/admin/AdminSpecialistsPage'));
const AdminCommunityPage = React.lazy(() => import('./pages/admin/AdminCommunityPage'));
const AdminNotificationsPage = React.lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminReportsPage = React.lazy(() => import('./pages/admin/AdminReportsPage'));

// Fallback loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth & Onboarding without standard layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/signup" element={<AuthPage type="signup" />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Admin Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/content" element={<AdminContentPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/specialists" element={<AdminSpecialistsPage />} />
            <Route path="/admin/community" element={<AdminCommunityPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>

          {/* Public Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Main User Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/hydration" element={<HydrationPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/advice" element={<AdvicePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
