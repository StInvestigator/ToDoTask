import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Pagination from '../components/Pagination';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const userId = localStorage.getItem('user_id');

    const fetchTasks = async (page) => {
        try {
            const response = await api.get(`/tasks/user?page=${page}&size=10`);
            setTasks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch tasks', error.response?.data?.message);
        }
    };


    useEffect(() => {
        if (userId) fetchTasks(currentPage);
    }, [userId, currentPage]);


    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks(currentPage);
            } catch (error) {
                console.error('Failed to delete task', error.response?.data?.message);
            }
        }
    };

    const getBadgeClass = (status) => {
        switch(status) {
            case 'DONE': return 'bg-success';
            case 'IN_PROGRESS': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Tasks from My To-Do</h2>
                <Link to="/tasks/new" className="btn btn-primary">Create New Task</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Priority</th>
                        <th>State</th>
                        <th>Operations</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">No tasks found. Create one!</td></tr>
                    ) : (
                        tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td className="fw-bold">{task.name}</td>
                                <td>{task.priority}</td>
                                <td><span className={`badge ${getBadgeClass(task.status)}`}>{task.status === "IN_PROGRESS" ? "IN PROGRESS" : task.status}</span></td>
                                <td className="d-flex align-items-center">
                                    <Link to={`/tasks/edit/${task.id}`} className="text-primary me-3 text-decoration-none">Edit</Link>
                                    <button onClick={() => handleDelete(task.id)} className="btn btn-link text-danger p-0 text-decoration-none">Remove</button>
                                </td >
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default TaskList;