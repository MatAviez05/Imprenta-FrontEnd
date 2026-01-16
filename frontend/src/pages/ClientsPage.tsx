import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import { ClientForm } from '../components/ClientForm';
import '../pages/css/ClientsPage.css'; 

// Inter
interface Client {
    _id: string;
    nombre: string;
    empresa: string;
    telefono: string;
    email: string;
    direccion: string;
}

type ClientFormData = Omit<Client, '_id'> & { _id?: string };

function ClientsPage() {
    const { token, logout } = useAuth();
    
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');

    // Control formulario
    const [editingClient, setEditingClient] = useState<Client | null>(null);


    // Carga de cliente mock
    useEffect(() => {
        const fetchClientsMock = async () => {

            setIsLoading(true);
            setError('');
            try{
                const response = await fetch('http://localhost:3000/api/clientes/list-clientes', {
                    headers: {
                        'Authorization': `${token}`
                    }
                })

                setClients(await response.json())
                setError('')
            }catch(error:any){
                console.error('Error al cargar todos los turnos:', error);
                if (error.response?.status !== 401) { 
                    setError('No se pudieron cargar todos los turnos. Por favor intenta más tarde.');
                }
            }finally{
                setIsLoading(false);
            }
            
        };
        fetchClientsMock();
    }, []);



    // Formulario alta
    const handleAlta = () => {
        // modo creacion
        setEditingClient({
            _id: '', nombre: '', empresa: '', telefono: '', email: '', direccion: ''
        } as Client); 
    };

    // Ediicion
    const handleEdit = (client: Client) => {
        setEditingClient(client);
    };

    // Guardar 
    const handleSave = async (clientData: ClientFormData) => {
        setError('');
       
        try {
            const isEditMode = !!clientData._id;

            const url = isEditMode 
            ? `http://localhost:3000/api/clientes/${clientData._id}` 
            : 'http://localhost:3000/api/clientes/auth/register';

            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
            },
                body: JSON.stringify({
                    nombre: clientData.nombre,
                    empresa: clientData.empresa,
                    telefono: clientData.telefono,
                    email: clientData.email,
                    direccion: clientData.direccion,
                    tipoUsuario: 'Cliente'
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la operación');
            }

            const dataSaved = await response.json()

            if (isEditMode) {
                setClients(prev => prev.map(p => p._id === dataSaved._id ? dataSaved : p));
            } else {
                setClients(prev => [...prev, dataSaved]);
            }
            
            setEditingClient(null); 
        } catch (err) {
            console.error('Error', err);
            setError('No se pudo guardar.');
        } 
    };

    // Cancelar
    const handleCancel = () => {
        setEditingClient(null);
    };

    // Eliminar
    const handleDelete = async (id: string, nombre: string) => {
        if (!window.confirm(`¿Seguro que quiere eliminar a ${nombre}?`)) {
            return;
        }

        setError('');
        setIsLoading(true); 
        try {
            const response = await fetch(`http://localhost:3000/api/clientes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `${token}` }
            })

            if (!response.ok){
                throw new Error('No se pudo eliminar el cliente')
            }
            setClients(prev => prev.filter(client => client._id !== id));
        } catch (err) {
            console.error('Error', err);
            setError('No se pudo eliminar.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    // Filtrado de clientes
    const filteredClients = (() => {
        if (!searchTerm) return clients;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return clients.filter(client => 
            client.nombre.toLowerCase().includes(lowerCaseSearch) ||
            client.empresa.toLowerCase().includes(lowerCaseSearch)
        );
    })();


    // Renderizado
    if (isLoading && clients.length === 0 && !editingClient) {
        return (
            <div className="clients-page-container loading-container">
                <p>Cargando lista de clientes...</p>
            </div>
        );
    }

    // Contenido Principal 
    return (
        <div className="clients-page-container">
            {editingClient && (
                <ClientForm 
                    // Si tiene ID pasa cliente, sino para el alta
                    initialData={editingClient._id ? editingClient : null} 
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            
            {/* NAVBAR */}
            <header>
                <nav className="navbar">
                    <div className="navbar-content">
                        <h2>Imprenta - Gestion de Clientes</h2>
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
                    <h1>Gestion de Clientes</h1>
                    <button className="btn-primary-link" onClick={handleAlta} disabled={isLoading || !!editingClient}>
                        Alta de Cliente
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {clients.length === 0 && !error && !isLoading && !editingClient ? (
                    <div className="empty-state">
                        <h3>No hay clientes registrados</h3>
                        <p>Inicia registrando tu primer cliente para comenzar a generar pedidos.</p>
                        <button className="btn-primary-link" onClick={handleAlta} disabled={isLoading || !!editingClient}>
                            Registrar Cliente
                        </button>
                    </div>
                ) : (
                    <div className="list-wrapper">
                        <div className="list-toolbar">
                            <input
                                type="text"
                                placeholder="Buscar por Nombre o Empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                disabled={isLoading || !!editingClient}
                            />
                        </div>
                        
                        <div className="clients-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Empresa</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map(client => (
                                        <tr key={client._id}>
                                            <td>{client.nombre}</td>
                                            <td>{client.empresa}</td>
                                            <td>{client.email}</td>
                                            <td>{client.telefono}</td>
                                            <td>{client.direccion}</td>
                                            <td>
                                                <button className="btn-link" onClick={() => handleEdit(client)} disabled={isLoading || !!editingClient}>
                                                    Modificar
                                                </button>
                                                {' | '}
                                                <button className="btn-link text-danger" onClick={() => handleDelete(client._id, client.nombre)} disabled={isLoading || !!editingClient}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredClients.length === 0 && !isLoading && <p className='text-center'>No hay resultados para "{searchTerm}"</p>}
                        </div>
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
        
    );
}

export default ClientsPage;