import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

function getRandomNumber() {
  return Math.random() * 100;
}

export function getData() {
  return [
    ["Label", "Value"],
    ["Speed", 50],
    // ["Memory", getRandomNumber()],
    // ["CPU", getRandomNumber()],
    // ["Network", getRandomNumber()],
  ];
}

export const options = {
  width: 300,
  height: 300,
  redFrom: 90,
  redTo: 100,
  yellowFrom: 75,
  yellowTo: 90,
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
