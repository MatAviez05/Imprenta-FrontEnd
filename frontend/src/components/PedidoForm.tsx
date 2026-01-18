import React, { useState } from 'react';
import './PedidoForm.css'

export interface Pedido {
    id?: number,
    _id?: number;
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

type PedidoFormData = Omit<Pedido, '_id'> & { _id?: number };

interface PedidoFormProps {
    initialData: Pedido | null; 
    onSave: (pedidoData: PedidoFormData) => Promise<void>; 
    onCancel: () => void;
}

const getInitialState = (data: Pedido | null): PedidoFormData => {
    if (data) {
        return data; 
    }

    return {
        id_cliente: 0,
        tipo_trabajo: '',
        cantidad: 1,
        tamaño: '',
        color: '',
        tipo_papel: '',
        estado: 'Pendiente',
        observaciones: '',
        estado_pago: 'Pendiente',
    };
};

export const PedidoForm: React.FC<PedidoFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<PedidoFormData>(() => getInitialState(initialData));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialData?._id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? Number(value) : value;

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error al intentar guardar el pedido:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="client-form-modal-overlay">
            <div className="client-form-modal">
                <h3>{isEditMode ? 'Modificar Pedido' : 'Nuevo Pedido'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="number" name="id_cliente" placeholder="ID Cliente" value={formData.id_cliente || ''} onChange={handleChange} required disabled={isSubmitting} />
                    </div>

                    <input type="text" name="tipo_trabajo" placeholder="Tipo de trabajo (Ej: Tarjetas)" value={formData.tipo_trabajo} onChange={handleChange} required disabled={isSubmitting} />
                    
                    <div className="form-row">
                        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required disabled={isSubmitting} />
                        <input type="text" name="tamaño" placeholder="Tamaño (Ej: A4)" value={formData.tamaño} onChange={handleChange} disabled={isSubmitting} />
                    </div>

                    <div className="form-row">
                        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} disabled={isSubmitting} />
                        <input type="text" name="tipo_papel" placeholder="Tipo de Papel" value={formData.tipo_papel} onChange={handleChange} disabled={isSubmitting} />
                    </div>

                    <select
                        name='estado'
                        value={formData.estado}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>

                    <select 
                        name="estado_pago" 
                        value={formData.estado_pago} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                    >
                        <option value="Pendiente">Pendiente (No pagado)</option>
                        <option value="Seña">Seña (Pago parcial)</option>
                        <option value="Pagado">Pagado (Total)</option>
                    </select>

                    <textarea 
                        name="observaciones" 
                        placeholder="Observaciones adicionales..." 
                        value={formData.observaciones} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                        rows={3}
                        style={{ resize: 'vertical', width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Registrar Pedido')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};