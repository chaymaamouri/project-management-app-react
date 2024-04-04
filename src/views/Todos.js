import React, { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import jwtDecode from 'jwt-decode';

function Dashboard() {
    const baseUrl = "http://127.0.0.1:8000/api"; // Modifier selon votre configuration
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    const [todo, setTodo] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        await api.get(baseUrl + '/todos' + user_id).then((res) => {
            console.log(res.data);
            setTodo(res.data);
        });
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {todo.map(todoItem => (
                        <tr key={todoItem.id}>
                            <td>{todoItem.title}</td>
                            <td>{formatDate(todoItem.date)}</td>
                            <td>{todoItem.completed ? "Validé" : "En attente"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
