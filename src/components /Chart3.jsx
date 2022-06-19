import $ from 'jquery';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import fuel from './FuelValue'


let fuel;
let GetCarData = function () {
  // const [,setState] = useState();
    $.ajax({
        type: "GET",
        url: "https://rpi1s3.s3.amazonaws.com/myKey",  //example: https://mydatabucket.s3.amazonaws.com/myKey"
        dataType: "json",
        async: false,
        success: function (data) {
            fuel = data.Fuel;  
            // setState({});

            // console.log('Chart Fue                         l :',parseFloat(data.Fuel));  
            // console.log("--------->>>",fuel);
        },
        error: function (xhr, status, error) {
            console.error("JSON error: " + status);
        }
    });
  }
  // console.log(">>>>>>>>>>>>>>>",fuel);
  setInterval(() => {
    GetCarData();
  }, 0);
const options = {
  title: {
    text: 'Fuel Consumption '
  },
  yAxis: {
    text: 'Fuel'
  },
  series: {
    data: [0.1,0.2,0.5,0.6,0.8,0.9,0.5,2,0.20,0.8,1.6,1.6,3,2,1,3,2,4,3,1,2]
  }
}
// options.series.data.push(parseFloat(fuel));
// options.series.data.push(10);
// options.series.data.push(15);
options.series.data.push(3);
// console.log(options.series.data)
// options.series.data.push(150);
// options.series.data.push(170);
// options.series.data.push(180);

const Chart3 = ({ aspect, title }) => {
  return (
    <div className="chart">
      <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
    </div>
  );
};

export default Chart3;