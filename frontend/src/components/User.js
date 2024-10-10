import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/fetch`);
            console.log("Fetched users:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching user list:", error);
            alert('Error fetching user list');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/insert`, { name, age });
            setNotification({ message: response.data.message, type: 'success' });
            fetchUsers(); // Fetch updated user list after insertion
            setName('');
            setAge('');
        } catch (error) {
            setNotification({ message: error.response?.data?.error || 'User insertion failed', type: 'error' });
        }
    };

    const closeNotification = () => {
        setNotification({ message: '', type: '' });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Age" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        required 
                    />
                </div>
                <button className="btn btn-primary" type="submit">Add User</button>
            </form>

            {notification.message && (
                <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} mt-3 alert-dismissible fade show`} role="alert">
                    {notification.message}
                    <button type="button" className="close" onClick={closeNotification}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}

            <h3 className="mt-4">User List</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user[0]}</td> {/* ID */}
                                <td>{user[1]}</td> {/* Name */}
                                <td>{user[2]}</td> {/* Age */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default User;
