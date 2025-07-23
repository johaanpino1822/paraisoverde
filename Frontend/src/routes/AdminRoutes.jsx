import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/Admin/Layout/AdminLayout';
import Dashboard from '../components/Admin/Dashboard';
import UserList from '../components/Admin/Users/UserList';
import UserEdit from '../components/Admin/Users/UserEdit';
import HotelList from '../components/Admin/Hotels/HotelList';
import HotelEdit from '../components/Admin/Hotels/HotelEdit';
import SiteList from '../components/Admin/Sites/SiteList';
import SiteEdit from '../components/Admin/Sites/SiteEdit';
import ProtectedRoute from './ProtectedRoute';

// Componente para evitar repetición de códigos
const ProtectedAdminRoute = ({ roles, element }) => (
  <ProtectedRoute allowedRoles={roles}>
    {element}
  </ProtectedRoute>
);

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<Dashboard />} 
            />
          } 
        />

        {/* Rutas de Usuarios */}
        <Route 
          path="/users" 
          element={
            <ProtectedAdminRoute 
              roles={['superadmin']} 
              element={<UserList />} 
            />
          } 
        />
        <Route 
          path="/users/new" 
          element={
            <ProtectedAdminRoute 
              roles={['superadmin']} 
              element={<UserEdit />} 
            />
          } 
        />
        <Route 
          path="/users/edit/:id" 
          element={
            <ProtectedAdminRoute 
              roles={['superadmin']} 
              element={<UserEdit />} 
            />
          } 
        />

        {/* Rutas de Hoteles */}
        <Route 
          path="/hotels" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<HotelList />} 
            />
          } 
        />
        <Route 
          path="/hotels/new" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<HotelEdit />} 
            />
          } 
        />
        <Route 
          path="/hotels/edit/:id" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<HotelEdit />} 
            />
          } 
        />

        {/* Rutas de Sitios */}
        <Route 
          path="/sites" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<SiteList />} 
            />
          } 
        />
        <Route 
          path="/sites/new" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<SiteEdit />} 
            />
          } 
        />
        <Route 
          path="/sites/edit/:id" 
          element={
            <ProtectedAdminRoute 
              roles={['admin', 'superadmin']} 
              element={<SiteEdit />} 
            />
          } 
        />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
