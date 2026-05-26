import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicOnlyRoute from '../components/PublicOnlyRoute'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import GigPostDetailPage from '../pages/GigPostDetailPage'
import GigPostsPage from '../pages/GigPostsPage'
import HomePage from '../pages/HomePage'
import MySkillsPage from '../pages/MySkillsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import SkillsPage from '../pages/SkillsPage'
import SocialLinksPage from '../pages/SocialLinksPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/skills"
          element={
            <ProtectedRoute>
              <MySkillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/sociallinks"
          element={
            <ProtectedRoute>
              <SocialLinksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <SkillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gigs"
          element={
            <ProtectedRoute>
              <GigPostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gigs/:gigPostId"
          element={
            <ProtectedRoute>
              <GigPostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
