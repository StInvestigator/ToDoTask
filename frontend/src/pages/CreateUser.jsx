import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            navigate('/users');
        } catch (error) {
            console.error('Creating user failed', error.response?.data?.message);
            alert('User creation failed: ' + error.response?.data?.message);
        }
    };

    const handleClear = () => {
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">New User registration</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">First name:</label>
                                <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last name:</label>
                                <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">E-mail:</label>
                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password:</label>
                                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;