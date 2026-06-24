import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ firstName: '', lastName: '', email: '', role: 'USER' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error.response?.data?.message || "network error");
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}/role`, { role: user.role });
            navigate('/users');
        } catch (error) {
            console.error('Failed to update user role', error.response?.data?.message || "network error");
            alert(error.response?.data?.message || "network error");
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header bg-white"><h4 className="mb-0">Update existing User</h4></div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Id</label>
                                <input type="text" className="form-control" value={id} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">First name</label>
                                <input type="text" className="form-control" value={user.firstName} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" value={user.lastName} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={user.email} disabled />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold text-primary">Role</label>
                                <select
                                    className="form-select border-primary"
                                    value={user.role}
                                    onChange={(e) => setUser({...user, role: e.target.value})}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;