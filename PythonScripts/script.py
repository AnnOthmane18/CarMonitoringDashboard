#!/usr/bin/env python2

import os 
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
 

MQTTClient = AWSIoTMQTTClient("RPI") 
MQTTClient.configureEndpoint("a1drqz04inqt2x-ats.iot.us-east-1.amazonaws.com", 8883) #configuring the endpoint of our object
MQTTClient.configureCredentials("/home/pi/AWS_RPI/RCA.pem","/home/pi/AWS_RPI/private.key","/home/pi/AWS_RPI/DevCert.crt") # configuring authentication credentials, to connect to aws cloud platform 

MQTTClient.configureConnectDisconnectTimeout(10)
MQTTClient.configureMQTTOperationTimeout(5)

print("initiating connection with aws...")
MQTTClient.connect() # after setting up the needed configuration and credentials, we connect to the cloud 


def translate(value, leftMin, leftMax, rightMin, rightMax):
        # Figure out how 'wide' each range is
        leftSpan = leftMax - leftMin
        rightSpan = rightMax - rightMin

        # Convert the left range into a 0-1 range (float)
        valueScaled = float(value - leftMin) / float(leftSpan)

        # Convert the 0-1 range into a value in the right range.
        return rightMin + (valueScaled * rightSpan)

os.system("sudo ifconfig can0 down") #here we disbale can0 interface for configuration
os.system("sudo ip link set can0 up type can bitrate 250000") # here we activate can0 interface, + setting up bitrate to 250k(why 250k? because the dashboard simulator that we used, use 250k baud/s in data transmission)

max_speed=0 # to degine the max range of speed for each gear position(1eme 2eme 3eme...)
while True:
   
    os.system("timeout 0.01s candump can0 > frames.txt") # here we redirect can frames to a file text, from which we will extract the data, using "candump" command
        # we added a timeout, to avoid the infinite loop(without using timeout the script couldn't execute the rest)

    with open('frames.txt') as infile:
        for line in infile:
            #  can0       1AA   [2]  81 01
	        if line.split()[1] == "1AA": # here we filter can frames by 1AA, to extract Gear position data(1AA is linked with gear position in the dashboard)
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
            if line.split()[1] == "2AA":  # here we filter can frames by 2AA, to extract SPEED-FUEL-TEMPERATURE data
                x = line.split()
                                    #   speed  fuel  temp                    
                # can0       2AA   [8]  FE 07 00 00 FE 07 A6 07

                #here we flip the lsb and msb to get the real value
                speed_lsb = (line.split()[3])[::-1] 
                speed_msb = (line.split()[4])[::-1]
               # print("speed_lsb >> ",speed_lsb)
               # print("speed_msb >> ",speed_msb)
                speed_hex = speed_msb + speed_lsb # merging the lsb and msb
                speed_dec = int(speed_hex,16)
                            #exported value    #max value from the simulator  #range for every gear position
                speed = translate(speed_dec, 0, 28911, 0, max_speed) 
                
               # print("speed_hex  > ",speed_hex)
                #print("speed_dec  > ",speed_dec)
                print("speed > ",speed)
                
                fuel_lsb = (line.split()[5])[::-1]
                fuel_msb = (line.split()[6])[::-1]
               # print("fuel_lsb >> ",fuel_lsb)
               # print("fuel_msb >> ",fuel_msb)
                fuel_hex = fuel_msb + fuel_lsb
                fuel_dec = int(fuel_hex,16)
                fuel = translate(fuel_dec, 0, 28911, 0, 1)
                
               # print("fuel_hex  > ",fuel_hex)
               # print("fuel_dec  > ",fuel_dec)
                print("fuel > ",fuel)
                
                temp_lsb = (line.split()[7])[::-1]
                temp_msb = (line.split()[8])[::-1]
                #print("temp_lsb >> ",temp_lsb)
                #print("temp_msb >> ",temp_msb)
                temp_hex = temp_msb + temp_lsb
                temp_dec = int(temp_hex,16)
                temp = translate(temp_dec, 0, 28911, 0, 120)
                #print("temp_hex  > ",temp_hex)
                #print("temp_dec  > ",temp_dec)
                print("temp  > ",temp)

                #publushing our data to the cloud platform (AWS IoT Core) 
                MQTTClient.publish(topic="RPI",QoS=1,payload='{"Speed":"'+str(speed)+'", "Temperature":"'+str(temp)+'","Fuel":"'+str(fuel)+'"}')
