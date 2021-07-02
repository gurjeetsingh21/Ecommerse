import React, { Component } from "react";
import Chart from "react-apexcharts";

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Quantity",
          data: props.quantity,
        },
        {
          name: "Sold",
          data: props.sold,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 430,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: false,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#fff"],
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        xaxis: {
          labels: {
            show: false, // disable labels
          },
          axisBorder: {
            show: true,
            color: "black",
            offsetX: 0,
            offsetY: 0,
          },

          categories: props.name,
        },
        yaxis: {
          show: true,

          axisBorder: {
            show: true,
            color: "black",
            offsetX: 0,
            offsetY: 0,
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={430}
        />
      </div>
    );
  }
}

export default BarChart;
