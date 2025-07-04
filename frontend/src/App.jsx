import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<CreateUser />} />
      <Route path="/edit/:id" element={<EditUser />} />
    </Routes>
  );
}

export default App;
