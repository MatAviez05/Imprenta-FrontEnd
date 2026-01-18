import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PedidoForm } from '../components/PedidoForm';
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

type PedidoFormData = Omit<Pedido, '_id'> & { _id?: number };

function TodosPedidosPage(){

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);

    //const navigate = useNavigate()

    const { token, logout } = useAuth()

    useEffect(() => {
        const fetchClientsMock = async () => {
            setIsLoading(true);
            setError('');
            try{
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/pedidos`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                })

                setPedidos(await response.json())
                setError('')
            }catch(error:any){
                console.error('Error al cargar todos los clientes:', error);
                if (error.response?.status !== 401) { 
                    setError('No se pudieron cargar todos los clientes. Por favor intenta más tarde.');
                }
            }finally{
                setIsLoading(false)
            }
        };
        fetchClientsMock();
    }, []);

    const handleAlta = () => {
        setEditingPedido({
            _id: 0, // 0 indica que es nuevo (temporal)
            id_cliente: 0,
            tipo_trabajo: '',
            cantidad: 1,
            tamaño: '',
            color: '',
            tipo_papel: '',
            estado: 'Pendiente',
            observaciones: '',
            estado_pago: 'Pendiente'
        } as Pedido);
    };

    const handleEdit = (pedido: Pedido) => {
        setEditingPedido(pedido);
    };

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
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/pedidos/${id}`, {

                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`
                }
            })

            if (!response.ok){
                throw new Error('No se pudo eliminar el cliente')
            }

            setPedidos(prev => prev.filter(pedido => pedido._id !== id))
            
        } catch (err) {
            console.error('Error', err);
            setError('No se pudo eliminar.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (pedidoData: PedidoFormData) => {
        setError('');
        try {
            const isEditMode = !!pedidoData._id

            const url = isEditMode
            ? `${import.meta.env.VITE_BASE_URL}/api/pedidos/${pedidoData._id}`
            : `${import.meta.env.VITE_BASE_URL}/api/pedidos`

            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    id_cliente: pedidoData.id_cliente,
                    tipo_trabajo: pedidoData.tipo_trabajo,
                    cantidad: pedidoData.cantidad,
                    tamaño: pedidoData.tamaño,
                    color: pedidoData.color,
                    tipo_papel: pedidoData.tipo_papel,
                    estado: pedidoData.estado,
                    observaciones: pedidoData.observaciones,
                    estado_pago: pedidoData.estado_pago
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la operación');
            }

            const dataSaved = await response.json()

            if(isEditMode){
                setPedidos(prev => prev.map(p => p._id === dataSaved._id ? dataSaved : p))
            }else{
                setPedidos(prev => [...prev, dataSaved])
            }
            
            setEditingPedido(null); // Cerrar modal

        } catch (err) {
            console.error('Error', err);
            setError('No se pudo guardar el pedido.');
        }
    };

    const handleCancel = () => {
        setEditingPedido(null);
    };

    const filteredPedidos = (() => {
        if (!searchTerm) return pedidos;
        const lowerCaseSearch = searchTerm.toLowerCase();
        // Filtramos por Tipo de Trabajo o Estado (puedes agregar más campos)
        return pedidos.filter(pedido =>
            pedido.tipo_trabajo.toLowerCase().includes(lowerCaseSearch) ||
            pedido.estado.toLowerCase().includes(lowerCaseSearch) ||
            pedido.id_cliente.toString().includes(lowerCaseSearch) // Búsqueda por ID cliente también
        );
    })();

    if (isLoading && pedidos.length === 0 && !editingPedido) {
        return (
            <div className="clients-page-container loading-container">
                <p>Cargando lista de clientes...</p>
            </div>
        );
    }

    return(
        <div className='todos-pedidos-conteiner'>
            {editingPedido && (
                <PedidoForm
                    initialData={editingPedido._id ? editingPedido : null}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            <header>
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
            </header>
            <div className='page-content'>
                <div className='page-header'>
                    <h1>Todos los Pedidos registrados</h1>
                    <button className="btn-primary-link" onClick={handleAlta} disabled={isLoading || !!editingPedido}>
                        Nuevo Pedido
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {pedidos.length === 0 && !error ? (
                    <div className="empty-state">
                        <h3>No hay pedidos registrados</h3>
                    </div>
                ) : (
                    <div className='list-wrapper'>
                        <div className="list-toolbar">
                            <input
                                type="text"
                                placeholder="Buscar por Tipo, Estado o ID Cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                disabled={isLoading || !!editingPedido}
                            />
                        </div>
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
                                            <button className="btn-link" onClick={() => handleEdit(pedido)} disabled={isLoading || !!editingPedido}>
                                                    Modificar
                                            </button>
                                            {' | '}
                                            <button className='btn-link text-danger' onClick={() => handleDelete(pedido._id)} disabled={isLoading || !!editingPedido}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPedidos.length === 0 && !isLoading && <p className='text-center'>No hay resultados para "{searchTerm}"</p>}
                    </div>
                )}
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
    )
}

export default TodosPedidosPage