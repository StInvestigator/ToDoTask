import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import api from '../api/axiosConfig';

const Profile = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({firstName: '', lastName: '', email: ''});
    const [profileMessage, setProfileMessage] = useState({type: '', text: ''});
    const email = localStorage.getItem('user_email')

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({oldPassword: '', newPassword: '', confirmPassword: ''});
    const [passwordMessage, setPasswordMessage] = useState({type: '', text: ''});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email
                });
            } catch (error) {
                console.error('Login failed', error.response?.data?.message);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage({type: '', text: ''});
        if (formData.email === email || window.confirm('Changing the email will force a logout, do you want to continue?')) {
            try {
                await api.put('/users/profile', formData);
                setProfileMessage({type: 'success', text: 'Profile updated successfully!'});
                if(formData.email !== email){
                    localStorage.clear();
                    navigate('/login');
                    window.location.reload();
                }
            } catch (error) {
                setProfileMessage({type: 'danger', text: 'Failed to update profile. ' + error.response?.data?.message});
            }
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({...passwordData, [e.target.name]: e.target.value});
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({type: '', text: ''});

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({type: 'danger', text: 'New passwords do not match!'});
            return;
        }

        try {
            await api.put('/users/profile/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMessage({type: 'success', text: 'Password changed successfully!'});
            setPasswordData({oldPassword: '', newPassword: '', confirmPassword: ''});
            setTimeout(() => setShowPasswordForm(false), 2000);
        } catch (error) {
            setPasswordMessage({type: 'danger', text: 'Failed to change password. Check your old password.'});
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">

                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">My Profile</h4>
                    </div>
                    <div className="card-body">
                        {profileMessage.text && (
                            <div className={`alert alert-${profileMessage.type}`} role="alert">
                                {profileMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleProfileSubmit}>
                            <div className="mb-3">
                                <label className="form-label">First name</label>
                                <input type="text" name="firstName" className="form-control" value={formData.firstName}
                                       onChange={handleProfileChange} required/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last name</label>
                                <input type="text" name="lastName" className="form-control" value={formData.lastName}
                                       onChange={handleProfileChange} required/>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className="form-control" value={formData.email}
                                       onChange={handleProfileChange} required/>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                >
                                    {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {showPasswordForm && (
                    <div className="card shadow-sm border-warning">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Password change</h5>
                        </div>
                        <div className="card-body">
                            {passwordMessage.text && (
                                <div className={`alert alert-${passwordMessage.type}`} role="alert">
                                    {passwordMessage.text}
                                </div>
                            )}
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Old Password</label>
                                    <input type="password" name="oldPassword" className="form-control"
                                           value={passwordData.oldPassword} onChange={handlePasswordChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" name="newPassword" className="form-control"
                                           value={passwordData.newPassword} onChange={handlePasswordChange} required
                                           minLength="6"/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" name="confirmPassword" className="form-control"
                                           value={passwordData.confirmPassword} onChange={handlePasswordChange} required
                                           minLength="6"/>
                                </div>
                                <button type="submit" className="btn btn-warning w-100">Update Password</button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;