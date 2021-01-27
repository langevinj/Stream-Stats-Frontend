import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js';

const BarChart = (chartConfig) => {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    return (
        <div>
            <canvas ref={chartContainer} />
        </div>
    );
};

export default BarChart;