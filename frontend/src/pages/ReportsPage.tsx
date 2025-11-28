import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import './css/ReportsPage.css'; 

// Interfaz para la estructura de datos de estado de trabajos
interface TrabajoEstado {
    estado: string;
    cantidad: number;
    color: string;
}

// Mock datos
const mockReportData = {
    trabajosPorEstado: [
        { estado: 'Pendiente', cantidad: 15, color: '#f0ad4e' },
        { estado: 'En Producción', cantidad: 35, color: '#007bff' },
        { estado: 'Finalizado', cantidad: 80, color: '#5cb85c' },
        { estado: 'Entregado', cantidad: 60, color: '#343a40' },
    ] as TrabajoEstado[], // Aseguramos el tipo para TypeScript
    ingresosMensuales: {
        meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        ingresos: [150000, 185000, 210000, 195000, 250000, 230000],
    },
    ingresoAnualEstimado: 2750000,
};

function ReportsPage() {
    const { logout } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return (
            <div className="reports-page-container loading-container">
                <p>Generando reportes...</p>
            </div>
        );
    }

    const { trabajosPorEstado, ingresosMensuales, ingresoAnualEstimado } = mockReportData;

    // LÓGICA CLAVE PARA ESCALAR BARRAS: Encuentra la cantidad más alta.
    const maxTrabajos = trabajosPorEstado.reduce((max, item) => 
        Math.max(max, item.cantidad), 0
    );


    return (
        <div className="reports-page-container">
            {/* NAVBAR */}
            <header>
                <nav className="navbar">
                    <div className="navbar-content">
                        <h2>Imprenta - Modulo de Reportes</h2>
                        <div className="navbar-right">
                            <Link to="/" className="btn-back">
                                Volver al Menu
                            </Link>
                            <button onClick={handleLogout} className="btn-logout">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <div className="page-content">
                <div className="page-header">
                    <h1>Reportes y Estadísticas</h1>
                </div>

                <div className="reports-grid">
                    
                    {/* TRABAJOS POR ESTADO (SIMPLE Y ESCALADO) */}
                    <div className="report-card full-width">
                        <h3>Trabajos por Estado Actual</h3>
                        <div className="data-list">
                            {trabajosPorEstado.map(item => {
                                // Cálculo del ancho: cantidad actual / cantidad máxima * 100
                                const widthPercentage = (item.cantidad / maxTrabajos) * 100;

                                return (
                                    <div key={item.estado} className="data-item">
                                        <span className="item-label">{item.estado} ({item.cantidad})</span>
                                        <div className="progress-bar-container">
                                            <div 
                                                className="progress-bar" 
                                                style={{ 
                                                    // Aplicación del escalado
                                                    width: `${widthPercentage}%`, 
                                                    backgroundColor: item.color 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* INGRESOS MENSUALES */}
                    <div className="report-card">
                        <h3>Ingresos del Ultimo Semestre</h3>
                        <div className="monthly-chart">
                            {ingresosMensuales.ingresos.map((ingreso, index) => {
                                const maxIngreso = Math.max(...ingresosMensuales.ingresos);
                                return (
                                    <div key={index} className="chart-bar-wrap">
                                        <div 
                                            className="chart-bar" 
                                            style={{ height: `${(ingreso / maxIngreso) * 80}%` }}
                                        ></div>
                                        <span className="chart-label">{ingresosMensuales.meses[index]}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="summary-text">Total acumulado: ${ingresosMensuales.ingresos.reduce((a, b) => a + b, 0).toLocaleString('es-AR')}</p>
                    </div>

                    {/* ESTIMACION INGRESOS ANUALES */}
                    <div className="report-card">
                        <h3>Ingreso Anual Estimado</h3>
                        <div className="annual-box">
                            <p className="annual-figure">
                                ${ingresoAnualEstimado.toLocaleString('es-AR')}
                            </p>
                            <p className="summary-text">Proyección basada en el rendimiento actual.</p>
                        </div>
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

export default ReportsPage;