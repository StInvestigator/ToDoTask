import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (userId) fetchTasks();
    }, [userId]);

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks/user/${userId}`);
            setTasks(response.data.content || []);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
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
                        <th>No.</th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Priority</th>
                        <th>State</th>
                        <th>Operations</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">No tasks found. Create one!</td></tr>
                    ) : (
                        tasks.map((task, index) => (
                            <tr key={task.id}>
                                <td>{index + 1}</td>
                                <td>{task.id}</td>
                                <td>{task.name}</td>
                                <td>{task.priority}</td>
                                <td><span className={`badge ${getBadgeClass(task.status)}`}>{task.status}</span></td>
                                <td>
                                    <Link to={`/tasks/edit/${task.id}`} className="text-primary me-3 text-decoration-none">Edit</Link>
                                    <button className="btn btn-link text-danger p-0 text-decoration-none">Remove</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;