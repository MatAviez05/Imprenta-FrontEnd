import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        setError('')
        setIsLoading(true)
        try{
            await login(email, password)

            navigate('/')

        }catch(err:any){
            setError(err.message || 'Error al iniciar sesión');
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <div className='login-conteiner'>
            <div className='login-card'>
                <h1>Imprenta - Inicio de Sesion</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='none@email.com'
                            disabled={isLoading}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Contraseña</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='..........'
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className='error-message'>
                            {error}
                        </div>
                    )}

                    <button
                    type='submit'
                    className='btn-primary'
                    disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando Sesion...' : 'Iniciar Sesion'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage