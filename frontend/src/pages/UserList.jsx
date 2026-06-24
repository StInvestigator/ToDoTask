import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../api/axiosConfig';
import Pagination from '../components/Pagination';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const userId = localStorage.getItem('user_id')

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const response = await api.get(`/users?page=${page}&size=10`);
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch users', error.response?.data?.message || "network error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers(currentPage);
            } catch (error) {
                console.error('Failed to delete', error.response?.data?.message || "network error");
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
                    <th>ID</th>
                    <th>Full name</th>
                    <th>E-mail</th>
                    <th>Role</th>
                    <th>Operations</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        {user.id == userId ?
                            <td className="fw-bold">{user.firstName} {user.lastName} <span className="badge text-black bg-warning p-1">(It`s you)</span> </td>
                            :
                            <td className="fw-bold">{user.firstName} {user.lastName} </td>}
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className="d-flex align-items-center">
                            {user.id != userId ? <>
                                    <Link to={`/users/edit/${user.id}`}
                                          className="text-primary me-3 text-decoration-none">Edit</Link>
                                    <button onClick={() => handleDelete(user.id)}
                                            className="btn btn-link text-danger p-0 text-decoration-none">Remove
                                    </button>
                                </>
                                :
                                <>
                                    <span
                                          className="me-3 text-decoration-none link-disabled">Edit</span>
                                    <button onClick={() => handleDelete(user.id)}
                                            className="btn btn-link text-danger p-0 text-decoration-none"
                                            disabled>Remove
                                    </button>
                                </>
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default UserList;