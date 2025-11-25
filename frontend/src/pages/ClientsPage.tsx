import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import { ClientForm } from '../components/ClientForm';
import '../pages/css/ClientsPage.css'; 

// Inter
interface Client {
    id: string;
    nombre: string;
    empresa: string;
    telefono: string;
    email: string;
    direccion: string;
}

type ClientFormData = Omit<Client, 'id'> & { id?: string };

// Mock datos
const initialMockClients: Client[] = [
    { id: '1', nombre: 'Ramiro', empresa: 'Impresiones', telefono: '11-1111-2222', email: 'rama@gmail.com', direccion: 'Calle 1' },
    { id: '2', nombre: 'Hector Gonzales', empresa: 'Papelera', telefono: '11-1122-2222', email: 'hector@gmail.com', direccion: 'Avenia 12' },
    { id: '3', nombre: 'Pedro Lopez', empresa: 'Grafica Total', telefono: '22-1111-2222', email: 'pedro@grafica.com', direccion: 'Ruta 5' },
];


function ClientsPage() {
    const { logout } = useAuth();
    
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
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setClients(initialMockClients);
            setIsLoading(false);
        };
        fetchClientsMock();
    }, []);



    // Formulario alta
    const handleAlta = () => {
        // modo creacion
        setEditingClient({
            id: '', nombre: '', empresa: '', telefono: '', email: '', direccion: ''
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
            await new Promise(resolve => setTimeout(resolve, 750)); 
            
            if (clientData.id) {
                // Edicion
                const updatedClient = clientData as Client;
                setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
            } else {
                // Alta
                const newClient: Client = {
                    ...clientData,
                    id: `c${Date.now()}` // Genera id para mock
                } as Client;
                setClients(prev => [...prev, newClient]);
            }
            
            setEditingClient(null); 
        } catch (err) {
            console.error('Error', err);
            setError('No se pudo guardar.');
            throw err; 
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
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setClients(prev => prev.filter(client => client.id !== id));
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
                    initialData={editingClient.id ? editingClient : null} 
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-content">
                    <h2>Imprenta - Gestion de Clientes</h2>
                    <div className="navbar-right">
                        <Link to="/dashboard" className="btn-back">
                            Volver al Dashboard
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
                                        <tr key={client.id}>
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
                                                <button className="btn-link text-danger" onClick={() => handleDelete(client.id, client.nombre)} disabled={isLoading || !!editingClient}>
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
        </div>
    );
}

export default ClientsPage;