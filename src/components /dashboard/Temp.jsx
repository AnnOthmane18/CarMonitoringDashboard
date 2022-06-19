import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import $ from "jquery";

let temp;
let getCarData = function () {
    $.ajax({
        type: "GET",
        url: "https://rpi1s3.s3.amazonaws.com/myKey",  //example: https://mydatabucket.s3.amazonaws.com/myKey"
        dataType: "json",
        async: false,
        success: function (data) {
            temp = data.Temperature;  
            console.log('temp :', data.Temperature);  
        },
        error: function (xhr, status, error) {
            console.error("JSON error: " + status);
        }
    });
  }
  setInterval(() => {
    getCarData();
  }, 1000);

export function getData() {
  return [
    ["Label", "Value"],
    // ["Temp", 80],
    ["Temp", parseInt(temp)],
  ];
}

export const options = {
  width: 300,
  height: 300,
  redFrom: 90,
  redTo: 120,
  yellowFrom: 75,
  yellowTo: 90,
  majorTicks:["0","30","60","90","120"],
  minorTicks: 5,
  max:120,
};


const GraphRender = () => {
  const [data, setData] = useState(getData);

  useEffect(() => {
    const id = setInterval(() => {
      setData(getData());
    }, 3000);

    return () => {
      clearInterval(id);
    };
  });
  return (
    <Chart
      chartType="Gauge"
      width="400px"
      height="400px"
      data={data}
      options={options}
    />
  );
};

export default GraphRender;
