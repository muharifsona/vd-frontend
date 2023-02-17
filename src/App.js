import './App.css';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './component/ProtectedRoute';
// import HomePage from './pages/HomePage';
import SigninPage from './pages/SigninPage';
import KriteriaAdminPage from './pages/admin/KriteriaAdminPage';
import AlternatifAdminPage from './pages/admin/AlternatifAdminPage';
import AlternatifKriteriaAdminPage from './pages/admin/AlternatifKriteriaAdminPage';
import PerbandinganAdminPage from './pages/admin/PerbandinganAdminPage';
import DematelAdminPage from './pages/admin/DematelAdminPage';
import VikorAdminPage from './pages/admin/VikorAdminPage';
import LoginAdminPage from './pages/admin/LoginAdminPage';

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage/>} /> */}
      <Route path="/" element={<SigninPage/>} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <DashboardAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/user" element={
        <ProtectedRoute>
          <LoginAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/kriteria" element={
        <ProtectedRoute>
          <KriteriaAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/alternatif" element={
        <ProtectedRoute>
          <AlternatifAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/alternatifkriteria" element={
        <ProtectedRoute>
          <AlternatifKriteriaAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/vikor" element={
        <ProtectedRoute>
          <VikorAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/perbandingan" element={
        <ProtectedRoute>
          <PerbandinganAdminPage/>
        </ProtectedRoute>
      } />
      <Route path="/admin/dematel" element={
        <ProtectedRoute>
          <DematelAdminPage/>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;
