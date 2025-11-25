import React, { useState } from 'react';
import './ClientForm.css';

// Inter
interface Client {
    id: string;
    nombre: string;
    empresa: string;
    telefono: string;
    email: string;
    direccion: string;
}


// Si tiene ID, es edicion. sino es alta
type ClientFormData = Omit<Client, 'id'> & { id?: string };

interface ClientFormProps {
    // Si pasa cliente es modo alta
    initialData: Client | null; 
    onSave: (clientData: ClientFormData) => Promise<void>; 
    onCancel: () => void;
}


const getInitialState = (data: Client | null): ClientFormData => {
    if (data) {
        return data; 
    }

    return {
        nombre: '',
        empresa: '',
        telefono: '',
        email: '',
        direccion: '',
    };
};

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<ClientFormData>(() => getInitialState(initialData));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialData?.id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simula validacion
        if (!formData.nombre || !formData.email) {
            alert("Nombre y Email tienen que estar.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error al intentar guardar el cliente:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="client-form-modal-overlay">
            <div className="client-form-modal">
                <h3>{isEditMode ? 'Modificar Cliente' : 'Alta de Nuevo Cliente'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required disabled={isSubmitting} />
                    <input type="text" name="empresa" placeholder="Empresa" value={formData.empresa} onChange={handleChange} required disabled={isSubmitting} />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                    <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} disabled={isSubmitting} />
                    <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} disabled={isSubmitting} />
                    
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Registrar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};