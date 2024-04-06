import network
import socket
import time
import random
import machine
import json

plant1 = 'tomato'
plant2 = 'chilli'

upper_range = 63000
lower_range = 0

# Wi-Fi credentials
ssid = 'Sophie&Dan'
password = 'sophladeshay2101'


# Connect to WLAN
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

# Wait for Wi-Fi connection
connection_timeout = 10
while connection_timeout > 0:
    if wlan.status() >= 3:
        break
    connection_timeout -= 1
    print('Waiting for Wi-Fi connection...')
    time.sleep(1)

# Check if connection is successful
if wlan.status() != 3:
    raise RuntimeError('Failed to establish a network connection')
else:
    print('Connection successful!')
    network_info = wlan.ifconfig()
    print('IP address:', network_info[0])

# Set up socket and start listening
addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen()

# Turn LED on when connected
led = machine.Pin(0, machine.Pin.OUT)
led.on()

# Initialize variables
tomato_sensor = machine.ADC(machine.Pin(27))
chilli_sensor = machine.ADC(machine.Pin(26))

# Main loop to listen for connections
while True:
    try:
        conn, addr = s.accept()
        print('Got a connection from', addr)
        
        # Receive and parse the request
        request = conn.recv(1024)
        request = str(request)
        print('Request content = %s' % request)

        try:
            request = request.split()[1]
            print('Request:', request)
        except IndexError:
            pass
        print('/moisture/' + plant1)
        # Process the request and update variables
        if request == '/moisture/' + plant1:
            percentage = 100*(tomato_sensor.read_u16() - lower_range)/(upper_range-lower_range)
            print('here')
            conn.send('HTTP/1.0 200 OK\r\nContent-type: application/json\r\nAccess-Control-Allow-Origin: http://localhost:3000\r\n\r\n')
            string_data = """{"data":  "%d"}""" %(percentage)
            response = json.loads(string_data)
            conn.send(string_data)
        elif request == '/moisture/' + plant2:
            percentage = 100*(chilli_sensor.read_u16() - lower_range)/(upper_range-lower_range)
            print('here')
            conn.send('HTTP/1.0 200 OK\r\nContent-type: application/json\r\nAccess-Control-Allow-Origin: http://localhost:3000\r\n\r\n')
            string_data = """{"data":  "%d"}""" %(percentage)
            response = json.loads(string_data)
            conn.send(string_data)
        # Send the HTTP response and close the connection
        
        conn.close()

    except OSError as e:
        conn.close()
        print('Connection closed')
        led.off()