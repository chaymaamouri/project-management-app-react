import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import useAxios from '../utils/useAxios';
import jwtDecode from 'jwt-decode';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function TasksChart() {
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
        await api.get(baseUrl + '/todo/' + user_id + '/').then((res) => {
            console.log(res.data);
            setTodo(res.data);
            drawChart(res.data);
        });
    };

    let myChart = null; // Déclarer une variable globale pour stocker l'instance du graphique

const drawChart = (data) => {
    const labels = data.map(todoItem => todoItem.date);
    const completedData = data.map(todoItem => todoItem.completed ? 1 : 0);
    
    const ctx = document.getElementById('tasksChart');

    // Vérifier si le graphique existant doit être détruit
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Validation des tâches au fil du temps',
                data: completedData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        adapter: 'date-fns'
                    }
                    
                },
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        callback: value => value === 1 ? 'Validé' : 'En attente'
                    }
                }
            }
        }
    });
};

    return (
        <div>
            <h2>Évolution des tâches au cours du temps</h2>
            <canvas id="tasksChart" style={{ width: "300px", height: "100px"}}></canvas>
        </div>
    );
}

export default TasksChart;
