import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './css/HomePage.css'; 

function DashboardPage() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="home-container">
            <header>
                <nav className="navbar">
                    <div className="navbar-content">
                        <h2>
                            Imprenta - Sistema de Gestión
                        </h2>
                        <div className="navbar-right">
                            <span className="user-greeting">Hola, {user?.nombre || user?.email}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/*Contenido Principal*/}
            <div className="home-content">
                <div className="welcome-section">
                    <h1 className="welcome-title">Bienvenido, {user?.nombre || 'Administrador'}</h1>
                    
                    <div className="user-info-card">
                        <div className="user-badge">
                            <span className="badge-text">Rol: Gestion</span>
                        </div>
                        <p className="user-email">{user?.email}</p>
                    </div>
                </div>

                <div className="actions-section">
                    <h2 className="section-title">Panel de Acciones</h2>

                    {/* MODULOS */}
                    <div className="actions-grid">
                        
                        {/* Clientes */}
                        <Link to="/clients" className="action-card">
                            <h3>Gestión de Clientes</h3>
                            <p>Crear, modificar y listar clientes.</p>
                        </Link>

                        {/* Pedidos */}
                        <Link to="/pedidos" className="action-card">
                            <h3>Órdenes y Pedidos</h3>
                            <p>Seguimiento de órdenes de trabajo.</p>
                        </Link>

                        {/* Reportes */}
                        <Link to="/reportes" className="action-card">
                            <h3>Reportes y Estadísticas</h3>
                            <p>Visualización de métricas de negocio.</p>
                        </Link>
                        
                        {/* Facturacion */}
                        <Link to="/facturacion" className="action-card">
                            <h3>Facturación</h3>
                            <p>Generación y gestión de facturas.</p>
                        </Link>
                        
                    </div>
                </div>
            </div>
            <nav className="footer-contenedor">
                <footer>
                    <small>
                        <a href="mailto:ramirogabeiras1998@gmail.com" target="_blank">Gabeiras Ramiro - </a>
                        <a href="mailto:juanbraun45@gmail.com" target="_blank">Juan Andrés Braun - </a>
                        <a href="mailto:baezavilamateo@gmail.com" target="_blank">Mateo Avila Baez - </a>
                        <a href="mailto:lautacb@gmail.com" target="_blank">Laurato Carrio</a>
                    </small>
                    <br></br>
                    &copy; copyright reserved
                </footer>
            </nav>
        </div>
    );
}

export default DashboardPage;