import './App.css'
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import UserList from "./pages/UserList.jsx";
import EditUser from './pages/EditUser';
import EditTask from './pages/EditTask';
import Register from './pages/Register.jsx';
import CollaborativeTasks from './pages/CollaborativeTasks';
import Profile from './pages/Profile'

function App() {
  return (
      <Router>
        <div className="bg-light min-vh-100">
          <Navbar />
          <div className="container pb-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<CreateUser />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<CreateTask />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
              <Route path="/tasks/edit/:id" element={<EditTask />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks/shared" element={<CollaborativeTasks />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;