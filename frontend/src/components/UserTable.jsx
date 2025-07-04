import { Link } from 'react-router-dom';

function UserTable({ users }) {
  return (
    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan="4">No users found.</td></tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/edit/${user.id}`}>
                  <button>Edit</button>
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;
