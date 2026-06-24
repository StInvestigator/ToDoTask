import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateTask = () => {
    const navigate = useNavigate();
    const ownerId = localStorage.getItem('user_id');
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        priority: 'LOW',
        ownerId: parseInt(ownerId),
        collaboratorIds: []
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users?page=0&size=100');
                setUsers(response.data.content.filter(u => u.id !== parseInt(ownerId)));
            } catch (error) {
                console.error('Failed to fetch users for collaborators', error.response?.data?.message || "network error");
            }
        };
        fetchUsers();
    }, [ownerId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCollaboratorSelect = (e) => {
        if(e.target.value === " ") return
        const selectedId = parseInt(e.target.value);
        if (selectedId && !formData.collaboratorIds.includes(selectedId)) {
            setFormData({
                ...formData,
                collaboratorIds: [...formData.collaboratorIds, selectedId]
            });
        }
    };

    const removeCollaborator = (idToRemove) => {
        setFormData({
            ...formData,
            collaboratorIds: formData.collaboratorIds.filter(id => id !== idToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            navigate('/tasks');
        } catch (error) {
            console.error('Error creating task', error.response?.data?.message || "network error");
        }
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white"><h4>Create new Task</h4></div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
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
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={() => setFormData({...formData, name: '', priority: 'LOW'})}>Clear</button>
                                <button type="submit" className="btn btn-primary">Create</button>
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
                                const user = users.find(u => u.id === collabId);
                                return user ? (
                                    <li key={collabId} className="list-group-item d-flex justify-content-between align-items-center">
                                        {user.firstName} {user.lastName}
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeCollaborator(collabId)}>Remove</button>
                                    </li>
                                ) : null;
                            })}
                        </ul>

                        <label className="form-label">Add new collaborator</label>
                        <select className="form-select" onChange={handleCollaboratorSelect} defaultValue="">
                            <option value="">Select collaborator...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;