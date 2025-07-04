import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/api';
import UserTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(setUsers).catch((err) => {
      console.error('Error fetching users:', err);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <button onClick={() => navigate('/create')} style={{ marginBottom: '20px' }}>
        Create New User
      </button>
      <UserTable users={users} />
    </div>
  );
}

export default Dashboard;
