#!/usr/bin/env python2

from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import re
import time 

with open('canFrames.log', 'rb') as file_in:
    with open("output.txt", "wb") as file_out:
        file_out.writelines(filter(lambda line: b'2AA' in line, file_in)) 


MQTTClient = AWSIoTMQTTClient("RPI") #defining our AWSIoTMQTTClient object 
MQTTClient.configureEndpoint("a1drqz04inqt2x-ats.iot.us-east-1.amazonaws.com", 8883)  #configuring the endpoint of our object
MQTTClient.configureCredentials("/home/pi/AWS_RPI/RCA.pem","/home/pi/AWS_RPI/private.key","/home/pi/AWS_RPI/DevCert.crt") # configuring authentication credentials, to connect to aws cloud platform 

MQTTClient.configureConnectDisconnectTimeout(10)
MQTTClient.configureMQTTOperationTimeout(5)

print("initiating connection with aws...")
MQTTClient.connect()# Connecting to AWS IOT core

scale = 16
i = 1
with open('output.txt') as infile:
    for line in infile:       
        
        result = re.sub(r"^.+?(?=2AA)", "",line,1)
        code_speed = result[7]+result[6]+result[5]+result[4]
        code_temperature = result[11]+result[10]+result[9]+result[8]
        
        binary_string = bin(int(code_speed, scale))[2:].zfill(len(code_speed)*4)
        binary_string2 = bin(int(code_temperature, scale))[2:].zfill(len(code_temperature)*4)
        
        engine_speed = 0.125 * int(binary_string,2)
        engine_temperature = int(binary_string2,2)
        #publishing the decoded can frame to the cloud using the publish method specifying the topic of our IOT thing + formatting the data into JSON format
        MQTTClient.publish(topic="RPI",QoS=1,payload='{"Speed":"'+str(engine_speed)+'", "Temperature":"'+str(engine_temperature)+'","Fuel":"'+str(fuel)+'"}')
        time.sleep(1)
        
        print("FRAME N# ",i)
        print("line > ",line)
        print("result > ",result)
        
        print("code for speed >>",code_speed)
        # # print()
        print("speed converted to binary >> ",binary_string)
        # # print()
        print("speed converted to decimal >> ",engine_speed)
        # print(engine_speed)
        
        # print("\n")
        
        print("code for temperature")
        print(code_temperature)
        print("temperature converted to binary")
        print(binary_string2)
        print("temperature converted to decimal")
        print(engine_temperature)
        i = i+1
        print("***************END OF FRAME*************************")
	
