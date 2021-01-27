import React, { Component } from 'react'
import Chart from "chart.js";

export default class BarGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "horizontalBar",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Streams",
                        data: []
                    }
                ]
            },
            options: {

            }
        });
    }
    render() {
        return (
            <div>
                <canvas id="myChart" ref={this.chartRef} />
            </div>
        )
    }
}