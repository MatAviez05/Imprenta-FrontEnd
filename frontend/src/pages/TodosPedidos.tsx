import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

const p1:Pedido = {_id:1, id_cliente:1, tipo_trabajo:'Oficina', cantidad:10, tamaño:'Grande', color:'Rojo', tipo_papel:'Fino', estado:'Proceso', observaciones:'-', estado_pago:'Sin Pagar'}
const p2:Pedido = {_id:2, id_cliente:8, tipo_trabajo:'Granadero', cantidad:15, tamaño:'Medio', color:'Azul', tipo_papel:'Grueso', estado:'Terminado', observaciones:'desgastado pero sirve', estado_pago:'Pagado'}
const p3:Pedido = {_id:3, id_cliente:6, tipo_trabajo:'Programador', cantidad:11, tamaño:'Pequeño', color:'Gris', tipo_papel:'Normal', estado:'Pendiente', observaciones:'-', estado_pago:'Sin Pagar'}



function TodosPedidosPage(){

    const [pedidos, setPedidos] = useState<Pedido[]>([p1, p2, p3]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const eliminarPedido = () => {

    }

    return(
        <div className='todos-pedidos-conteiner'>
            <div className='page-content'>
                <div className='page-header'>
                    Todos los Pedidos registrados
                </div>

                {error && <div className="error-message">{error}</div>}

                {pedidos.length === 0 && !error ? (
                    <div className="empty-state">
                        <h3>No hay pedidos registrados</h3>
                    </div>
                ) : (
                    <div className='pedidos-table-conteiner'>
                        <table>
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
                                            <button className='btn-cancelar' onClick={eliminarPedido}>
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