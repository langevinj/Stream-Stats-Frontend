import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApexCharts from 'apexcharts'

function BarGraph({seriesData, songs, range}){
    const series = range === "alltime" ? [seriesData.bandcamp_alltime, seriesData.spotify_alltime, seriesData.amazon, seriesData.apple, seriesData.deezer, seriesData.itunes, seriesData.google, seriesData.tidal, seriesData.tiktok, seriesData.youtube] : [seriesData.bandcamp_month, seriesData.spotify_month]

    const options = {
        chart: {
            type: 'bar',
            height: '100%',
            stacked: true
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '100%', 
                dataLabels: {
                    position: 'top',
                },
            }
        },
        colors: ['#12939A', '#1DB954', '#FF9900', '#f285ca', '#c1f1fc', '#EA4CC0', '#3bccff', '#2ed1a3', '#EE1D52', '#FF0000'],
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
            categories: songs,
        },
    };

    return(
        <>
            <ReactApexChart options={options} series={series} type="bar" height={430} />
        </>
    )


}

export default BarGraph;