import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, userId, role, firstName, lastName } = response.data;

            localStorage.setItem('jwt_token', token);
            localStorage.setItem('user_id', userId);
            localStorage.setItem('user_role', role);
            localStorage.setItem('user_first_name', firstName);
            localStorage.setItem('user_last_name', lastName);

            navigate('/tasks');
            window.location.reload();
        } catch (error) {
            console.error('Login failed', error);
            alert('Invalid email or password');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-white"><h4 className="mb-0">Sign In</h4></div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">E-mail:</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password:</label>
                                <input type="password" name="password" className="form-control" onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                            <div className="text-center">
                                <Link to="/users/new">Don't have an account? Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;