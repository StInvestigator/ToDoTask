import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers(); // Обновляем список
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>List of Users</h2>
                <Link to="/users/new" className="btn btn-primary">Create new User</Link>
            </div>

            <table className="table table-striped table-hover shadow-sm">
                <thead className="table-light">
                <tr>
                    <th>No.</th>
                    <th>Full name</th>
                    <th>E-mail</th>
                    <th>Operations</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                            <Link to={`/users/edit/${user.id}`} className="text-primary me-3 text-decoration-none">Edit</Link>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-link text-danger p-0 text-decoration-none">Remove</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;