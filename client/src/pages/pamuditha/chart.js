import React, {useEffect, useState, useRef} from 'react';
import {Bar} from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Layout = () => {
    const [users, setUsers] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [usersByMonth, setUsersByMonth] = useState({});
    const chartContainerRef = useRef(null); // Ref for the container

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('https://servertest-isos.onrender.com/api/user', {
                credentials: 'include',
            });
            const data = await response.json();
            setUsers(data.users);

            const calculatedUsersByMonth = data.users.reduce((acc, user) => {
                const month = new Date(user.date).toLocaleString('default', {
                    month: 'long',
                });
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {});
            setUsersByMonth(calculatedUsersByMonth);
        };
        fetchUsers();
    }, []);

    const chartData = {
        labels: Object.keys(usersByMonth),
        datasets: [
            {
                label: 'User Registrations',
                data: Object.values(usersByMonth),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Registrations by Month',
            },
        },
    };

    const generatePdf = () => {
        const element = chartContainerRef.current; // Target the container
        const options = {
            margin: 1,
            filename: 'user_registrations.pdf',
            image: {type: 'png'}, // Set to PNG
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };

        // Create a PDF from the HTML element
        html2pdf().from(element).set(options).save();
    };

    const fetchGrowthPrediction = async () => {
        try {
            const response = await fetch('https://servertest-isos.onrender.com/predict-registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userRegistrationData: usersByMonth}),
            });

            const data = await response.json();
            setPrediction(data.prediction);
        } catch (error) {
            console.error('Error fetching prediction:', error);
            setPrediction('Error generating prediction');
        }
    };

    return (
        <div>
            <h1>User Registration Chart</h1>

            <div ref={chartContainerRef} className="relative"> {/* Container for the chart and banner */}
                {/* Banner Image (you can remove this completely if you don't need it) */}
                {/* <img src={banner} alt="Header Banner" className="w-full h-auto mb-4"/> */}

                <div className="chart-area"> {/* Container specifically for the chart */}
                    <Bar data={chartData} options={chartOptions}/>
                </div>
            </div>

            <button
                onClick={generatePdf}
                className="mt-4 p-2 bg-pink-500 text-white rounded"
            >
                Download PDF
            </button>

            <div className="mt-8">
                <h2>AI-Powered Growth Prediction</h2>
                <button
                    onClick={fetchGrowthPrediction}
                    className="glow-on-hover julius-sans-one-regular justify-center content-center pt-3 flex flex-row w-[300px] px-4 py-2"
                >
                    Get AI - Growth Prediction and Suggestions
                </button>

                {prediction && (
                    <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                        <h3>Prediction:</h3>
                        <p>{prediction.growthTrend}</p>
                        <h4>Peak Seasons:</h4>
                        <ul>
                            {prediction.peakSeasons.map((season, index) => (
                                <li key={index}>{season}</li>
                            ))}
                        </ul>

                        <h4>Suggestions:</h4>
                        <ul>
                            {Object.entries(prediction.suggestions).map(([category, suggestions]) => (
                                <li key={category}>
                                    <b>{category}:</b>
                                    <ul>
                                        {suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;