import { useState, useEffect } from 'react';

const allPrivileges = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL PRIVILEGES'];

function UserForm({ initialData = {}, onSubmit }) {
  const [username, setUsername] = useState(initialData.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData.role || 'user');
  const [privileges, setPrivileges] = useState(initialData.privileges || []);

  const togglePrivilege = (priv) => {
    setPrivileges((prev) =>
      prev.includes(priv)
        ? prev.filter((p) => p !== priv)
        : [...prev, priv]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password, role, privileges });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username: </label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password: </label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
      </div>
      <div>
        <label>Role: </label>
        <input value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <div>
        <label>Privileges:</label>
        <div>
          {allPrivileges.map((priv) => (
            <label key={priv} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                value={priv}
                checked={privileges.includes(priv)}
                onChange={() => togglePrivilege(priv)}
              />
              {priv}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ marginTop: '15px' }}>Submit</button>
    </form>
  );
}

export default UserForm;
