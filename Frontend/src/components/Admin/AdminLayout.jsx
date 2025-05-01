import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    const titles = {
      '/admin': 'Panel de Administración',
      '/admin/posts': 'Gestionar Publicaciones',
      '/admin/posts/new': 'Crear Nueva Publicación',
      '/admin/gallery': 'Gestionar Galería',
      '/admin/profile': 'Perfil de Usuario',
      '/admin/settings': 'Configuración'
    };

    if (path.startsWith('/admin/posts/edit/')) return 'Editar Publicación';
    
    return titles[path] || 'Panel de Administración';
  };

  const SidebarLink = ({ to, icon, label, active, collapsed = false }) => {
    return (
      <Link
        to={to}
        className={`flex items-center ${!collapsed ? 'px-3' : 'justify-center px-2'} py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
          active
            ? 'bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-primary-400 shadow-inner'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        <div className={`${!collapsed ? 'mr-3' : ''} flex-shrink-0`}>
          {React.cloneElement(icon, {
            className: active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
          })}
        </div>
        {!collapsed && (
          <span className="truncate transition-opacity duration-200">
            {label}
          </span>
        )}
        {!collapsed && active && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-white shadow-lg dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle sidebar"
          aria-expanded={isMobileSidebarOpen}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileSidebarOpen}
      >
        <div 
          className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" 
          onClick={toggleMobileSidebar}
        />
        <div 
          className={`absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-lg font-semibold font-heading text-gray-800 dark:text-white">Admin Panel</span>
            </div>
            <button 
              onClick={toggleMobileSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="py-4 h-[calc(100%-4rem)] overflow-y-auto">
            <nav className="space-y-1 px-2">
              <SidebarLink 
                to="/admin" 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={location.pathname === '/admin'} 
              />
              <SidebarLink 
                to="/admin/posts" 
                icon={<FileText size={20} />} 
                label="Publicaciones" 
                active={location.pathname.includes('/admin/posts')} 
              />
              <SidebarLink 
                to="/admin/gallery" 
                icon={<Image size={20} />} 
                label="Galería" 
                active={location.pathname === '/admin/gallery'} 
              />
              <SidebarLink 
                to="/admin/profile" 
                icon={<User size={20} />} 
                label="Perfil" 
                active={location.pathname === '/admin/profile'} 
              />
              <SidebarLink 
                to="/admin/settings" 
                icon={<Settings size={20} />} 
                label="Configuración" 
                active={location.pathname === '/admin/settings'} 
              />
            </nav>
            <div className="px-2 mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <LogOut className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                Cerrar Sesión
              </button>
            </div>
            <div className="px-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col md:z-40 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'} transition-all duration-300 ease-in-out`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between px-4' : 'justify-center px-2'} h-16 border-b border-gray-200 dark:border-gray-700`}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center">
                  <Logo className="h-8 w-auto" />
                  <span className="ml-2 text-lg font-semibold font-heading text-gray-800 dark:text-white">Admin Panel</span>
                </div>
                <button 
                  onClick={toggleSidebar}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Expand sidebar"
              >
                <Logo className="h-8 w-auto" />
              </button>
            )}
          </div>
          <div className="flex flex-col justify-between flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <SidebarLink 
                to="/admin" 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={location.pathname === '/admin'} 
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                to="/admin/posts" 
                icon={<FileText size={20} />} 
                label="Publicaciones" 
                active={location.pathname.includes('/admin/posts')} 
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                to="/admin/gallery" 
                icon={<Image size={20} />} 
                label="Galería" 
                active={location.pathname === '/admin/gallery'} 
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                to="/admin/profile" 
                icon={<User size={20} />} 
                label="Perfil" 
                active={location.pathname === '/admin/profile'} 
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                to="/admin/settings" 
                icon={<Settings size={20} />} 
                label="Configuración" 
                active={location.pathname === '/admin/settings'} 
                collapsed={!isSidebarOpen}
              />
            </nav>
            <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className={`flex items-center ${isSidebarOpen ? 'px-2' : 'justify-center px-1'} mb-4`}>
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                {isSidebarOpen && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.role}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center ${isSidebarOpen ? 'px-2' : 'justify-center px-1'} py-2 w-full text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-200 group`}
              >
                <LogOut className={`${isSidebarOpen ? 'mr-3' : ''} h-5 w-5 group-hover:animate-pulse`} />
                {isSidebarOpen && 'Cerrar Sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`md:pl-${isSidebarOpen ? '64' : '20'} transition-all duration-300 ease-in-out`}>
        <header className={`bg-white dark:bg-gray-800 sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${isScrolled ? 'shadow-sm py-2' : 'py-4'}`}>
          <div className="flex items-center justify-between h-12 px-4 md:px-6">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="hidden md:flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm">Volver al sitio</span>
              </Link>
              <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="hidden md:block p-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  <div className="hidden md:flex flex-col items-end mr-3">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium shadow-inner group-hover:ring-2 ring-primary-400 transition-all duration-200">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 transition-all duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;