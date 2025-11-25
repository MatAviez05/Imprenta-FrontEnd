import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/css/PedidosPage.css'

interface Pedido{
    _id:number
    id_cliente:number
    tipo_trabajo:string
    cantidad: number,
    tamaño: string
    color: string
    tipo_papel: string
    estado: string
    observaciones: string
    estado_pago: string
}

const initialMockPedidos:Pedido[] = [
    {_id:1, id_cliente:1, tipo_trabajo:'Oficina', cantidad:10, tamaño:'Grande', color:'Rojo', tipo_papel:'Fino', estado:'Proceso', observaciones:'-', estado_pago:'Sin Pagar'},
    {_id:2, id_cliente:8, tipo_trabajo:'Granadero', cantidad:15, tamaño:'Medio', color:'Azul', tipo_papel:'Grueso', estado:'Terminado', observaciones:'desgastado pero sirve', estado_pago:'Pagado'},
    {_id:3, id_cliente:6, tipo_trabajo:'Programador', cantidad:11, tamaño:'Pequeño', color:'Gris', tipo_papel:'Normal', estado:'Pendiente', observaciones:'-', estado_pago:'Sin Pagar'},
    {_id:4, id_cliente:2, tipo_trabajo:'Kiosquero', cantidad:18, tamaño:'Medio', color:'Verde', tipo_papel:'Normal', estado:'Proceso', observaciones:'-', estado_pago:'Sin Pagar'}
]


function TodosPedidosPage(){

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');


    const navigate = useNavigate()

    const { logout } = useAuth()

    useEffect(() => {
        const fetchClientsMock = async () => {
            setIsLoading(true);
            setError('');
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setPedidos(initialMockPedidos);
            setIsLoading(false);
        };
        fetchClientsMock();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(`¿Seguro que quiere eliminar este pedido?`)) {
            return;
        }

        setError('');
        setIsLoading(true); 
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setPedidos(prev => prev.filter(pedido => pedido._id !== id));
        } catch (err) {
            console.error('Error', err);
            setError('No se pudo eliminar.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && pedidos.length === 0) {
        return (
            <div className="clients-page-container loading-container">
                <p>Cargando lista de clientes...</p>
            </div>
        );
    }

    return(
        <div className='todos-pedidos-conteiner'>
            <nav className="navbar">
                <div className="navbar-content">
                    <h2>Imprenta - Gestion de Clientes</h2>
                    <div className="navbar-right">
                        <Link to="/" className="btn-back">
                            Volver al Menu
                        </Link>
                        <button onClick={handleLogout}className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
            <div className='page-content'>
                <div className='page-header'>
                    <h1>Todos los Pedidos registrados</h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                {pedidos.length === 0 && !error ? (
                    <div className="empty-state">
                        <h3>No hay pedidos registrados</h3>
                    </div>
                ) : (
                    <div className='list-wrapper'>
                        <table className='data-table'>
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>ID Cliente</th>
                                    <th>Tipo de Trabajo</th>
                                    <th>Cantidad</th>
                                    <th>Tamaño</th>
                                    <th>Color</th>
                                    <th>Tipo de Papel</th>
                                    <th>Estado del pedido</th>
                                    <th>Observaciones</th>
                                    <th>Estado del Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) =>(
                                    <tr key={pedido._id}>
                                        <td><strong>{pedido._id}</strong></td>
                                        <td>{pedido.id_cliente}</td>
                                        <td>{pedido.tipo_trabajo}</td>
                                        <td>{pedido.cantidad}</td>
                                        <td>{pedido.tamaño}</td>
                                        <td>{pedido.color}</td>
                                        <td>{pedido.tipo_papel}</td>
                                        <td>{pedido.estado}</td>
                                        <td>{pedido.observaciones}</td>
                                        <td>{pedido.estado_pago}</td>
                                        <td>
                                            <button className='btn-cancelar' onClick={() => handleDelete(pedido._id)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TodosPedidosPage