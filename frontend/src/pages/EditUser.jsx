import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../services/api';
import UserForm from '../components/UserForm';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserById(id).then(data => {
      setUserData({
        username: data.username,
        role: data.role,
        privileges: data.privileges || [],
      });
    }).catch(err => {
      console.error('Failed to load user:', err);
    });
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await updateUser(id, data);
      navigate('/');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (!userData) return <p>Loading user data...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit User</h1>
      <UserForm initialData={userData} onSubmit={handleUpdate} />
    </div>
  );
}

export default EditUser;
