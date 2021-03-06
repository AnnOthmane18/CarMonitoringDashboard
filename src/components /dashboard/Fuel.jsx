import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import $ from "jquery";

let fuel;
let getCarData = function () {
    $.ajax({
        type: "GET",
        url: "https://rpi1s3.s3.amazonaws.com/myKey",  //example: https://mydatabucket.s3.amazonaws.com/myKey"
        dataType: "json",
        async: false,
        success: function (data) {
            fuel = data.Fuel;  
            console.log('fuel :',data.Fuel);  
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
    // ["Fuel", 0.22],
    ["Fuel", parseFloat(fuel)],
    // ["Memory", getRandomNumber()],
    // ["CPU", getRandomNumber()],
    // ["Network", getRandomNumber()],
  ];
}

export const options = {
  width: 300,
  height: 300,
  redFrom: 0,
  redTo: 0.1,
  yellowFrom: 0.1,
  yellowTo: 0.2,
  majorTicks:["0","0.2","0.4","0.6","0.8","1"],
  max:1,
  minorTicks: 5,
  
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
