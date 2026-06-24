import {Link, useNavigate} from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt_token');
    const role = localStorage.getItem('user_role');
    const isAuthenticated = !!token;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">ToDos Tasks</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto my-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>

                        {isAuthenticated && (<>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tasks">My Tasks</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tasks/shared">Collaborations</Link>
                                </li>
                            </>
                        )}

                        {isAuthenticated && role === 'ADMIN' && (
                            <li className="nav-item"><Link className="nav-link" to="/users">List of Users</Link></li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {isAuthenticated ? (<>
                                <li className="nav-item me-3">
                                    <Link className="nav-link" to="/profile">My Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-outline-light" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;