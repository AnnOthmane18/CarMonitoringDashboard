## Project overview
This project is about a WEB Dashboard that tracks the car state via AWS cloud infratructure

### Built With

**Hardware:**
* [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
* [2-Channel CAN Module](https://www.waveshare.com/2-ch-can-hat.htm)
**Software:**
* [React.js](https://reactjs.org/)
* [Python](https://python.org)
* [mui](https://mui.com)

## Project Global Architecture
![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/architecture.png)

### Project HARD Architecture
![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/architecture1.png)
In this part, we connect our car dashboard simulator with the raspberry Pi 4, which is already linked with the CAN shield, through 2 wires CAN High & CAN Low, to extract can frames from the simulator.
In order to extract CAN Frames we used **CAN-Utils**.
**CAN Utils:** It's a Linux specific set of utilities that enables Linux to communicate with the CAN network on the vehicle, such that we can sniff, spoof and create our own CAN packets to pwn the vehicle! 

### CAN Utils Installation

First of all, we are going to set up our environment(installing Raspbian in the Raspberry Pi) 

1. Installing the  can-utils
  ```sh
   apt-get install can-utils
   ``` 
2. Loading all the required drivers
   ```sh
   modprobe can
   modprobe can-dev
   modprobe can-raw
   ```
3. Add the following lines to your Config.txt file, to enable SPI, as well as CAN0 & CAN1 interfaces
   ```sh
   sudo nano /boot/config.txt
   ```
   ```sh
   dtparam=spi=on
   dtoverlay=mcp2515-can1,oscillator=16000000,interrupt=25
   dtoverlay=mcp2515-can0,oscillator=16000000,interrupt=23
   ```
   ```sh
   sudo reboot
   ```
4. Set up CAN in raspbian(choose your appropriate bit rate, 250k B/s in my case)
   ```sh
   Sudo ifconfig can0 down
   sudo ip link set can0 up type can bitrate 250000
   ```
to Extract CAN Frames, type the following cmds:
* First, check that your can interface is running/UP(can0/can1)
  ```sh
  candump can0/can1
  ```
* To store CAN Frames in a log file 
  ```sh
  candump -l can0/can1
  ```
* To store CAN Frames in a .txt file 
  ```sh
  candump -l can0/can1
  ```

<p align="right">(<a href="#top">back to top</a>)</p>


**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
