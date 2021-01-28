import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApexCharts from 'apexcharts'

function BarGraph({ seriesData, songs }){
    const series = [{
        data: [44, 55, 41, 64, 22, 43, 21]
    }, {
        data: [53, 32, 33, 52, 13, 44, 32]
    }];

    const options = {
        chart: {
            type: 'bar',
            height: 430
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },
    };

    return(
        <>
            <ReactApexChart options={options} series={series} type="bar" height={430} />
        </>
    )


}

export default BarGraph;