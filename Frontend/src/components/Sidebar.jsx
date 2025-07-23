// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUserAlt, FaMapSigns, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Panel Admin</h2>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/admin/dashboard">
                            <FaHome /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-users">
                            <FaUserAlt /> Gestión de Usuarios
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-destinations">
                            <FaMapSigns /> Gestión de Destinos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/logout">
                            <FaSignOutAlt /> Cerrar Sesión
                        </NavLink>   
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
