// src/components/SessionsTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SessionsTable = () => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/sessions/')
            .then(response => setSessions(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Sessions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Date</th>
                        <th>Available Seats</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(session => (
                        <tr key={session.movie.title}>
                            <td>{session.movie.title}</td>
                            <td>{session.sessiondatetime}</td>
                            <td>{session.availableseats}</td>
                            <td>{session.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SessionsTable;
