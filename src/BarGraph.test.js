// import React from 'react';
// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { MemoryRouter } from 'react-router-dom'
// import BarGraph from './BarGraph.js';
// import { songs, seriesData } from './_testCommon.js';

// import ApexCharts from "apexcharts";
// import ReactApexChart from "react-apexcharts";

// jest.mock("react-apexcharts", () =>
//   jest.fn(() => {
//     return null;
//   })
// );
// jest.mock("apexcharts", () => ({
//   exec: jest.fn(() => {
//     return new Promise((resolve, reject) => {
//       resolve("uri");
//     });
//   })
// }));

// it("renders without crashing", function() {
//     render(<>
//              <BarGraph songs={songs} seriesData={seriesData} range={"month"}/>
//            </>);
// });


