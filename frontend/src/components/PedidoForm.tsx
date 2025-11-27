import React, { useState } from 'react';
import './PedidoForm.css'

export interface Pedido {
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
        if (!formData.tipo_trabajo || formData.cantidad <= 0 || !formData.id_cliente) {
            alert("Por favor completa el tipo de trabajo, una cantidad válida y el ID del cliente.");
            return;
        }

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

                    {/*Hacer mas adelante un select*/}
                    <input type="text" name="estado" placeholder="Estado (Ej: En proceso)" value={formData.estado} onChange={handleChange} disabled={isSubmitting} />

                    {/*Hacer mas adelante un select*/}
                    <input type="text" name="estado_pago" placeholder="Estado Pago (Ej: Seña)" value={formData.estado_pago} onChange={handleChange} disabled={isSubmitting} />

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