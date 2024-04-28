import network
import socket
import time
import random
import machine, neopixel
import json
import machine, neopixel
import time
import requests

def set_one_led(np, index, colour):
    np[index] = colour
    np.write()
    
def set_all_leds(np, colour):
    i = 0
    while i < 8:
        np[i] = colour
        i += 1
    np.write()

np = neopixel.NeoPixel(machine.Pin(5), 8)

# Wi-Fi credentials
ssid = ''
password = ''


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
np = neopixel.NeoPixel(machine.Pin(5), 8)

# Main loop to listen for connections
while True:
    try:
        conn, addr = s.accept()
        print('Got a connection from', addr)
        
        # Receive and parse the request
        request = conn.recv(2048)
        request = str(request)
        print('Request content = %s' % request)

        try:
            url_extension = request.split()[1]
            print('Request:', request)
        except IndexError:
            pass
        # Process the request and update variables
        if url_extension == '/pc_on':
            print('pc on')
            conn.send('HTTP/1.0 200 OK\r\nContent-type: application/json\r\nAccess-Control-Allow-Origin: http://localhost:3000\r\n\r\n')
            
        elif url_extension == '/set_colour':
            body = request.split('\\r\\n\\r\\n')[1]
            body = body.replace("'", "")
            print("Colour:")
            print(body)
            conn.send('HTTP/1.0 200 OK\r\n\r\n')
            colours = json.loads(body)
            colour = (colours["r"], colours["g"], colours["b"])
            if colours["index"] == -1:
                set_all_leds(np, colour)
            else:
                set_one_led(np, colours["index"], colour)
        
        conn.close()

    except OSError as e:
        conn.close()
        print('Connection closed')
        led.off()