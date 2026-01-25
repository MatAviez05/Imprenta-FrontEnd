import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import '../pages/css/ReportsPage.css'; 

// interfaz 
interface Pedido {
    _id: number;
    id_cliente: number;
    tipo_trabajo: string;
    cantidad: number;
    tamaño: string;
    color: string;
    tipo_papel: string;
    estado: string; 
    observaciones: string;
    estado_pago: string;
}

// Grafico de estados
interface EstadoData {
    estado: string;
    cantidad: number;
    color: string;
}

function ReportsPage() {
    const { token, logout } = useAuth();
    
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch de datos
    useEffect(() => {
        const fetchPedidos = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/pedidos`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener datos del servidor');
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setPedidos(data);
                } else {
                    setPedidos([]);
                }
                
            } catch (err) {
                console.error("Error fetching reports data:", err);
                setError('No se pudieron cargar los reportes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPedidos();
    }, [token]);

    const handleLogout = () => {
        logout();
    };

    // Logica de los DATOS

    // Calcular "Trabajos por Estado" 
    const trabajosPorEstado: EstadoData[] = useMemo(() => {
        if (pedidos.length === 0) return [];

        const mapaEstados: Record<string, string> = {
            'Pendiente': '#f0ad4e',
            'En Proceso': '#007bff',
            'Terminado': '#5cb85c',
            'Entregado': '#343a40'
        };

        // Contar ocurrencias
        const conteo = pedidos.reduce((acc, pedido) => {
            const estadoNormalizado = pedido.estado || 'Pendiente'; 
            acc[estadoNormalizado] = (acc[estadoNormalizado] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Transformar a array 
        return Object.keys(mapaEstados).map(estado => ({
            estado,
            cantidad: conteo[estado] || 0,
            color: mapaEstados[estado]
        }));
    }, [pedidos]);

    // 2. Mock de Ingresos (Esto se mantiene estatico por falta de 'precio en DB')
    const mockIngresosData = {
        ingresosMensuales: {
            meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            ingresos: [150000, 185000, 210000, 195000, 250000, 230000],
        },
        ingresoAnualEstimado: 2750000,
    };

    const { ingresosMensuales, ingresoAnualEstimado } = mockIngresosData;
    const totalPedidos = pedidos.length || 1; 

    if (isLoading) {
        return (
            <div className="reports-page-container-loading-container">
                <p>Generando estadísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reports-page-container">
                <p className="error-text">{error}</p>
                <Link to="/" className="btn-back">Volver</Link>
            </div>
        );
    }

    return (
        <div className="reports-page-container">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-content">
                    <h2>Imprenta - Modulo de Reportes</h2>
                    <div className="navbar-right">
                        <Link to="/" className="btn-back">
                            Volver a Menu
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="page-content">
                <div className="page-header">
                    <h1>Reportes y Estadísticas</h1>
                </div>

                <div className="reports-grid">
                    
                    {/* TRABAJOS POR ESTADO */}
                    <div className="report-card full-width">
                        <h3>Trabajos por Estado Actual</h3>
                        <div className="data-list">
                            {trabajosPorEstado.length > 0 ? (
                                trabajosPorEstado.map(item => (
                                    <div key={item.estado} className="data-item">
                                        <span className="item-label">{item.estado} ({item.cantidad})</span>
                                        <div className="progress-bar-container">
                                            <div 
                                                className="progress-bar" 
                                                style={{ 
                                                    width: `${(item.cantidad / totalPedidos) * 100}%`, 
                                                    backgroundColor: item.color 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay trabajos registrados para generar metricas.</p>
                            )}
                        </div>
                    </div>

                    {/* INGRESOS MENSUALES */}
                    <div className="report-card">
                        <h3>Ingresos del Último Semestre (Estimado)</h3>
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
                        <small style={{display:'block', marginTop:'10px', color:'#999'}}>* Datos financieros simulados (Falta precio en BD)</small>
                    </div>

                    {/* ESTIMACION INGRESOS ANUALES */}
                    <div className="report-card">
                        <h3>Ingreso Anual Estimado</h3>
                        <div className="annual-box">
                            <p className="annual-figure">
                                ${ingresoAnualEstimado.toLocaleString('es-AR')}
                            </p>
                            <p className="summary-text">Proyeccion basada en el rendimiento actual.</p>
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