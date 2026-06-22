import './App.css'
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import UserList from "./pages/UserList.jsx";

function App() {
  return (
      <Router>
        <div className="bg-light min-vh-100">
          <Navbar />
          <div className="container pb-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<CreateUser />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<CreateTask />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;