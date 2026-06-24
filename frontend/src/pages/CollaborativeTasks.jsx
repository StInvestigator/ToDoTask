import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Pagination from '../components/Pagination';

const CollaborativeTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const userId = localStorage.getItem('user_id');

    const fetchTasks = async (page) => {
        try {
            const response = await api.get(`/tasks/collaborator?page=${page}&size=10`);
            setTasks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch collaborative tasks', error.response?.data?.message || "network error");
        }
    };

    useEffect(() => {
        if (userId) fetchTasks(currentPage);
    }, [userId, currentPage]);


    const getBadgeClass = (status) => {
        switch(status) {
            case 'DONE': return 'bg-success';
            case 'IN_PROGRESS': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h2>Shared with Me</h2>
                <p className="text-muted">Tasks where you are listed as a collaborator (Read-Only).</p>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Priority</th>
                        <th>State</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">No collaborative tasks found.</td></tr>
                    ) : (
                        tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td className="fw-bold">{task.name}</td>
                                <td>{task.owner.firstName} {task.owner.lastName}</td>
                                <td>{task.priority}</td>
                                <td><span className={`badge ${getBadgeClass(task.status)}`}>{task.status}</span></td>
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

export default CollaborativeTasks;