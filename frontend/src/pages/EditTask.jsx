import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('user_id');
    const [allUsers, setAllUsers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        priority: 'LOW',
        status: 'TODO',
        collaboratorIds: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await api.get('/users?page=0&size=100');
                setAllUsers(usersRes.data.content.filter(u => u.id !== parseInt(currentUserId)));

                const taskRes = await api.get(`/tasks/${id}`);
                const task = taskRes.data;
                setFormData({
                    name: task.name,
                    priority: task.priority,
                    status: task.status,
                    collaboratorIds: task.collaborators.map(c => c.id)
                });
            } catch (error) {
                console.error('Failed to load data', error);
            }
        };
        fetchData();
    }, [id, currentUserId]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCollaboratorSelect = (e) => {
        const selectedId = parseInt(e.target.value);
        if (selectedId && !formData.collaboratorIds.includes(selectedId)) {
            setFormData({ ...formData, collaboratorIds: [...formData.collaboratorIds, selectedId] });
        }
    };

    const removeCollaborator = (idToRemove) => {
        setFormData({ ...formData, collaboratorIds: formData.collaboratorIds.filter(collabId => collabId !== idToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/${id}`, formData);
            navigate('/tasks');
        } catch (error) {
            console.error('Error updating task', error);
        }
    };

    return (
        <div className="row">
            <div className="col-md-6 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-white"><h4>Update existing Task</h4></div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Id</label>
                                <input type="text" className="form-control" value={id} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Priority</label>
                                <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">State</label>
                                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                            <div className="mt-3">
                                <Link to="/tasks" className="text-decoration-none">Go to Task List</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header bg-white"><h4>Collaborators</h4></div>
                    <div className="card-body">
                        <ul className="list-group mb-3">
                            {formData.collaboratorIds.map(collabId => {
                                const user = allUsers.find(u => u.id === collabId);
                                return user ? (
                                    <li key={collabId} className="list-group-item d-flex justify-content-between align-items-center">
                                        {user.firstName} {user.lastName}
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeCollaborator(collabId)}>Remove</button>
                                    </li>
                                ) : null;
                            })}
                        </ul>
                        <label className="form-label">Add new collaborator</label>
                        <select className="form-select" onChange={handleCollaboratorSelect} value="">
                            <option value="" disabled>Select collaborator...</option>
                            {allUsers.map(user => (
                                <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTask;