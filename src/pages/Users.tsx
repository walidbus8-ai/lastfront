import { useEffect, useState } from "react";
import api from "../api/api";

interface User {
  name: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get("/users")
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="list-disc pl-5">
          {users.map((u, index) => (
            <li key={index}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;