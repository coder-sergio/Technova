import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'; // api es tu instancia de Axios
import Swal from 'sweetalert2'

type Inputs = { email: string; password: string }

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>()
    const navigate = useNavigate()



    const onSubmit = async (data: Inputs) => {
        try {
            // Consulta al backend Express
            const response = await api.get('/usuarios', {
                params: { email: data.email, password: data.password }
            });
            if (response.data.length > 0) {
                localStorage.setItem('user', JSON.stringify(response.data[0]));
                navigate('/dashboard');
            } else {
                Swal.fire({ title: 'Error', text: 'Invalid credentials.', icon: 'error' });
            }
        } catch (e) {
            Swal.fire({ title: 'Error', text: 'Unable to connect to the server.', icon: 'error' });
        }
    };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm mb-1">Email</label>
                    <InputText id="email" className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                        placeholder="admin@tech.com"
                        {...register('email', { required: true })} />
                    {errors.email && <span className="text-red-500 text-xs">Email is required.</span>}
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm mb-1">Password</label>
                    <InputText id="password" type="password" className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                        placeholder="admin123"
                        {...register('password', { required: true })} />
                    {errors.password && <span className="text-red-500 text-xs">Password is required.</span>}
                </div>

                <Button label={isSubmitting ? 'Logging in...' : 'Login'} type="submit" className="w-full" disabled={isSubmitting} />
            </form>
        </div>
    )
}
