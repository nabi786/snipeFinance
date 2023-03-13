import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
const Chart = () => {
  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    animationEnabled: true,
    title: {
      text: '',
    },
    backgroundColor: '#25284b',
    theme: 'dark2',
    axisY: {
      //   title: 'Net Generation (in Billion kWh)',
      //   suffix: 'BNB',
    },
    data: [
      {
        type: 'splineArea',
        xValueFormatString: 'YYYY',
        // yValueFormatString: '#,##0.## bn kW⋅h',
        showInLegend: true,
        legendText: 'input/output chart',
        dataPoints: [
          { x: new Date(2008, 0), y: 70 },
          { x: new Date(2009, 0), y: 75 },
          { x: new Date(2010, 0), y: 72 },
          { x: new Date(2011, 0), y: 78 },
          { x: new Date(2012, 0), y: 71 },
          { x: new Date(2013, 0), y: 79 },
          { x: new Date(2014, 0), y: 76 },
          { x: new Date(2015, 0), y: 77 },
          { x: new Date(2016, 0), y: 73 },
          { x: new Date(2017, 0), y: 74 },
        ],
      },
    ],
  };
  return (
    <>
      <CanvasJSChart
        options={options}
        /* onRef={ref => this.chart = ref} */
      />
      {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </>
  );
};

export default Chart;
// module.exports = Chart;
