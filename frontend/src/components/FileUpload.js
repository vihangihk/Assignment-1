import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNotification({ message: response.data.message, type: 'success' });
            setFile(null); // Reset file input
        } catch (error) {
            setNotification({ message: error.response?.data?.error || 'File upload failed', type: 'error' });
        }
    };

    const closeNotification = () => {
        setNotification({ message: '', type: '' });
    };

    return (
        <div className="container mt-5">
            <h2>Upload File</h2>
            <input type="file" onChange={handleFileChange} className="form-control" />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload</button>

            {notification.message && (
                <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} mt-3 alert-dismissible fade show`} role="alert">
                    {notification.message}
                    <button type="button" className="close" onClick={closeNotification}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
