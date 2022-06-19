import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import $ from "jquery";


let speed;
export const options = {
  width: 300,
  height: 300,
  redFrom: 450,
  redTo: 500,
  yellowFrom: 400,
  yellowTo: 450,
  minorTicks: 15,
  majorTicks:["0","100","200","300","400","500"],
  max:500,
};

let getCarData = function () {
  $.ajax({
      type: "GET",
      url: "https://rpi1s3.s3.amazonaws.com/myKey", 
      dataType: "json",
      async: false,
      success: function (data) {
          speed = data.Speed;  
          console.log('speed :', data.Speed);  
      },
      error: function (xhr, status, error) {
          console.error("JSON error: " + status);
      }
  });
}
setInterval(() => {
  getCarData();
}, 500);


export function getData() {
  return [
    ["Label", "Value"],
    ["Speed", parseInt(speed)],
    // ["Speed", 300],
  ];
}

const Speed = () => {
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

export default Speed;
