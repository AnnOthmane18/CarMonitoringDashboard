# Project overview
This project is about a WEB Dashboard that tracks the car state via AWS cloud infratructure

## Built With

**Hardware:**
* [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
* [2-Channel CAN Module](https://www.waveshare.com/2-ch-can-hat.htm)
**Software:**
* [React.js](https://reactjs.org/)
* [Python](https://python.org)
* [mui](https://mui.com)

# Project Global Architecture
![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/architecture.png)

## Project HARD Architecture
![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/architecture1.png)
In this part, we connect our car dashboard simulator with the raspberry Pi 4, which is already linked with the CAN shield, through 2 wires CAN High & CAN Low, to extract can frames from the simulator.
In order to extract CAN Frames we used **CAN-Utils**.
**CAN Utils:** It's a Linux specific set of utilities that enables Linux to communicate with the CAN network on the vehicle, such that we can sniff, spoof and create our own CAN packets to pwn the vehicle! 

## CAN Utils Installation

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
To Extract CAN Frames, type the following cmds:
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
  candump can0/can1 > fileName.txt
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Project SOFT Architecture
![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/architecture2.png)
In this part, we transfer all the extrated data from CAN Frames, directly to the **AWS Cloud**(IoT Core), through the **MQTT** protocol.
### AWS Cloud
Preparing the Cloud Environment.
#### AWS IoT Core
  1. Creating **IoT thing**, that will represent the embedded card used in this project(Raspberry PI 4)
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/create_thing.png)

  2. Creating IoT thing's **Policy**, so that our raspberry pi can Publish, Subscribe, and Connect to the AWS IoT Core
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/policy.png)

  3. Download the different certificates and keys(Private&Public Key,Root Certificate, Device Certificate), for Authentication
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/certificates.png)

  4. Creating a **Role**(Action) for our IoT thing, which will store the received data into an S3 Bucket in a JSON Format
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/rule.png)
  5. Testing our connection with the AWS Cloud(Subcribing to our Topic **"RPI"**, that we will use it in our python script)
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/MQTT_TEST.png)

#### S3 Bucket
  1. Creating our S3 Bucket that will received JSON Data from IoT Core 
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/create_bucket.png)
  2. Making our bucket public
  ![alt text](https://github.com/AnnOthmane18/CarMonitoringDashboard/blob/master/resources/block_access.png)
  
## Code
### Python Script
* **Libraries Used:**
```sh
import os #for executing linux commands inside python script 
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient #to connect to AWS IoT Core
```
* **Defining MQTTClient Object, with a unique IoT Topic:**
```sh
MQTTClient = AWSIoTMQTTClient("RPI") #Topic = 'RPI'
```
* **Configuring the endpoint(it's in the settings section of AWS IoT Core Service) of our object:**
```sh
MQTTClient.configureEndpoint("a1drqz04inqt2x-ats.iot.us-east-1.amazonaws.com", 8883) #8883: default port for MQTT Protocol
```
* **configuring authentication credentials, to connect to aws cloud:**
```sh
MQTTClient.configureCredentials("/home/pi/AWS_RPI/RCA.pem","/home/pi/AWS_RPI/private.key","/home/pi/AWS_RPI/DevCert.crt") # Root Cert,Private key, Device Cert
```
* **Trying to connect to AWS IoT Core:**
```sh
MQTTClient.connect() 
```
* **Mapping Function:**
```sh
def translate(value, leftMin, leftMax, rightMin, rightMax):
        # Figure out how 'wide' each range is
        leftSpan = leftMax - leftMin
        rightSpan = rightMax - rightMin

        # Convert the left range into a 0-1 range (float)
        valueScaled = float(value - leftMin) / float(leftSpan)

        # Convert the 0-1 range into a value in the right range.
        return rightMin + (valueScaled * rightSpan)
```
* **Configuring can0 interface inside puthon script:**
```sh
os.system("sudo ifconfig can0 down") #disbaling can0 interface for configuration
os.system("sudo ip link set can0 up type can bitrate 250000")
```
* **Launching Candump command to extract CAN Frames:**(Timeout >> just to quit the command, and executing the rest of the script):
```sh
while True:
    os.system("timeout 0.01s candump can0 > frames.txt")
```
* **Opening .txt file and reading it line by line:**
```sh
 with open('frames.txt') as infile:
        for line in infile:
```
* **filtering CAN frames by 1AA, to extract Gear position data(1AA is linked with gear position in the dashboard simulator)**
```sh
          # can0       1AA   [2]  81 01
	        if line.split()[1] == "1AA": 
                gear = line.split()
                gear_position = (line.split()[3]) #returning the 1st byte of the data frame(the byte responsible for varying the gear position value) 
                #11 41 21 81: we got those values, by changing the gear position manually in the simulator, and visualizing the variation in the terminal
                if gear_position == "11":
                    max_speed = 40
                elif gear_position == "21":
                    max_speed = 80
                elif gear_position == "41":
                    max_speed = 120
                elif gear_position == "81":
                    max_speed = 180 
```
```sh
if line.split()[1] == "2AA":  # here we filter can frames by 2AA, to extract SPEED-FUEL-TEMPERATURE data
                x = line.split()
```
* **Converting the extracted data(Speed - Temp - Fuel), using the <a href="#Mapping-Function:">mapping function</a>:**
```sh
speed = translate(speed_dec, 0, 28911, 0, max_speed) # max_speed change, progressively with the gear position 
temp = translate(temp_dec, 0, 28911, 0, 120) # 0 > 120 real interval
fuel = translate(fuel_dec, 0, 28911, 0, 1) # 0 > 1 real interval
```
* **Publishing data to AWS in JSON Format:**
```sh
MQTTClient.publish(topic="RPI",QoS=1,payload='{"Speed":"'+str(speed)+'", "Temperature":"'+str(temp)+'","Fuel":"'+str(fuel)+'"}')
```
