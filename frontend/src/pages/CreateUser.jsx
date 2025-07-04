import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import api from '../services/api';

function CreateUser() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await api.post('/users', data);
      navigate('/');
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create New User</h1>
      <UserForm onSubmit={handleCreate} />
    </div>
  );
}

export default CreateUser;
