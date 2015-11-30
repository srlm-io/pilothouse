# pilothouse

Pilothouse is a project to build an autonomous sailboat using Node.js on the Intel Edison.

[![](http://srlm.io/public/images/2015/7/2/boat_three_quarter_small.jpg)](http://srlm.io/public/images/2015/7/2/boat_three_quarter.jpg)

The goal of Pilothouse is to make an open source robotic sailboat that can autonomously navigate and sail itself long distances, and to prove that this can be done using the latest web technology: Node.js.

Pilothouse has a number of awesome features, including:

1. Robotic sailing, with 100% all natural renewable energy.
2. WiFi based monitoring with remote GUI.
3. Full Ubuntu Linux environment onboard.
4. Advanced sensors, including the latest GPS and MEMS.
5. Potential for expansion into a fully autonomous ocean going science vessel.
6. Javascript Node.js based control system.
7. Open source software ([GitHub](https://github.com/srlmproductions/pilothouse)).

At this time, this project is just starting to get into autonomous control. Here's the first sail, with autonomous sail control and manual RC rudder.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Va_YkqsxY9U" frameborder="0" allowfullscreen></iframe>

As part of the Pilothouse project the base station displays all relevant boat state information, sent over WiFi. 

[![](http://srlm.io/public/images/2015/7/2/base_station_with_boat_small.jpg)](http://srlm.io/public/images/2015/7/2/base_station_with_boat.jpg)
*The boat transmits the current state over WiFi, which is received by a long range USB WiFi antenna on the laptop. No software besides a web browser is needed.*

This project was inspired by my volunteer work with Diane at [RoboSail](http://www.robosail.org/), an awesome project to teach kids programming through robotic sailboats.

**Read the complete introduction to pilothouse [here](http://srlm.io/2015/07/02/introducing-pilothouse-a-robotic-sailboat/).**

# BOM

Total BOM cost is $1063.33.

## Mechanical

| Item | $/Unit | Qty | Total | Purchase |
|------|--------|-----|-------|----------|
| Ragazza 1 Meter Sailboat                                         | $349.99 | 1 | $349.99 | [src](http://www.proboatmodels.com/Products/Default.aspx?ProdID=PRB07000)               | 
| Spectra 65lb test fishing line                                   | $39.30   | 1 | $39.30       | | 
| Sugru                                                            | $21.38  | 2 | $42.76  | [src](http://www.amazon.com/gp/product/B00EU7DBNM/)                                     | 
| Pelican 1020 Case                                                | $11.95  | 1 | $11.95  | [src](http://www.amazon.com/gp/product/B001Q21Y0G/)                                     | 
| Stainless Steel Round Rod 72”                                    | $7.89   | 1 | $7.89   | [src](http://www.amazon.com/gp/product/B000H9OPDW/)                                     | 
| Stainless Steel Fender Washer, 50                                | $6.20    | 1 | $6.20    | [src](http://www.amazon.com/gp/product/B009OL3BSY/)                                     | 
| Stainless Steel Knurled Nut, #8-32                               | $3.91   | 4 | $15.64  | [src](http://www.amazon.com/gp/product/B00GKYUJWE/)                                     | 
| Stainless Steel Machine Screw, 1”, #8-32, 100                    | $7.26   | 1 | $7.26   | [src](http://www.amazon.com/gp/product/B00918BJHU/)                                     | 
| Wind Indicator                                                   | $13.90   | 1 | $13.90   | [src](http://www.orgsites.com/oh/western-reserve-model-yacht-club/Wind%20Indicator.pdf) | 
| LED Holder (panel)                                               | $0.50    | 5 | $2.50    | [src](https://www.sparkfun.com/products/11147)                                          | 
| 303 Stainless Steel Tight-Tolerance Rod, 1/16" Diameter, 2' Long | $6.35   | 2 | $12.70   | [src](http://www.mcmaster.com/)                                                         | 
| Elastic Cord                                                     | $1.49   | 1 | $1.49   |                                                                                  | 
| Steel Rings, 3/4” diameter                                       | $1.49   | 3 | $4.47   | | 
| Thumb Nuts, #8-32, plastic shell, brass insert                   | $4.39   | 4 | $17.56  | | 
| **Subtotal** |  |  | **$533.61** | | 


## Electronics

| Item | $/Unit | Qty | Total | Purchase |
|------|--------|-----|-------|----------|
| Intel Edison                                                     | $49.95  | 1 | $49.95  | [src](https://www.sparkfun.com/products/13024)                                          | 
| UBLOX NEO-M8N GPS                                                | $79.99  | 1 | $79.99  | [src](http://www.csgshop.com/product.php?id_product=174)                                | 
| Rotary Encoder, MA3-P10-125-B                                    | $66.75  | 1 | $66.75  | [src](http://www.usdigital.com/products/encoders/absolute/rotary/shaft/ma3)             | 
| USB Micro B Panel Mount Extension Cable, M-F, 1ft                | $9.95   | 4 | $39.80   | [src](http://www.datapro.net/products/usb-micro-b-panel-mount-extension-cable-m-f.html) | 
| Encoder plug and wire, 6 feet CA-MIC3-W3-NC-6                    | $9.30    | 1 | $9.30    | [src](http://www.usdigital.com/products/encoders/absolute/rotary/shaft/MA3)             | 
| LiPo Battery, 2000mAh                                            | $12.95  | 2 | $25.90   | [src](https://www.sparkfun.com/products/8483)                                           | 
| JST Jumper 2 Wire Assembly                                       | $0.95   | 2 | $1.90    | [src](https://www.sparkfun.com/products/9914)                                           | 
| SparkFun LiPo Charger Basic Micro USB                            | $7.95   | 2 | $15.90   | [src](https://www.sparkfun.com/products/10217)                                          | 
| LiPower Boost Converter                                          | $14.95  | 1 | $14.95  | [src](https://www.sparkfun.com/products/10255)                                          | 
| SparkFun LiPo Fuel Gauge                                         | $9.95   | 2 | $19.90   | [src](https://www.sparkfun.com/products/10617)                                          | 
| SparkFun Level Translator Breakout PCA9306                       | $6.95   | 1 | $6.95   | [src](https://www.sparkfun.com/products/11955)                                          | 
| Pro Micro 5V/16MHz                                               | $19.95  | 1 | $19.95  | [src](https://www.sparkfun.com/products/12640)                                          | 
| SparkFun Block 9 DOF                                             | $34.95  | 1 | $34.95  | [src](https://www.sparkfun.com/products/13033)                                          | 
| SparkFun Block I2C                                               | $14.95  | 1 | $14.95  | [src](https://www.sparkfun.com/products/13034)                                          | 
| SparkFun Block GPIO                                              | $14.95  | 1 | $14.95  | [src](https://www.sparkfun.com/products/13038)                                          | 
| SparkFun Block microSD                                           | $19.95  | 1 | $19.95  | [src](https://www.sparkfun.com/products/13041)                                          | 
| SparkFun Block PWM                                               | $19.95  | 1 | $19.95  | [src](https://www.sparkfun.com/products/13042)                                          | 
| SparkFun Block Base                                              | $32.95  | 1 | $32.95  | [src](https://www.sparkfun.com/products/13045)                                          | 
| Edison Hardware Pack                                             | $2.95   | 3 | $8.85   | [src](https://www.sparkfun.com/products/13187)                                          | 
| 32GB USB SD Card                                                 | $13.99  | 1 | $13.99  | [src](http://www.amazon.com/gp/product/B00M55C0NS)                                      | 
| 4 Channel RC Multiplexer                                         | $9.95   | 1 | $9.95   | [src](https://www.pololu.com/product/2806)                                              | 
| Full Size Rasberry Pi Perma Board Project board                  | $7.99   | 1 | $7.99   | [src](http://www.mcmelectronics.com/product/ADAFRUIT-INDUSTRIES-1135-/28-17466)         | 
| **Subtotal** |  |  | **$529.72** | | 


# Setup Notes

Below you'll find some assorted notes on setting up the system. At some point they'll get properly organized.


## Intel Edison (Yocto Image)

Install a Yocto image on your Edison.

From serial console run `configure_edison --setup`. Choose `pilothouse` for the name.

Then, from the pilothouse repository on your development computer, run `provision.sh`. Make sure that you are on the same network as your Edison (`pilothouse.local`).

## Useful Commands

Analyze startup speed:
systemd-analyze blame

# systemctl start [name.service]
# systemctl stop [name.service]
# systemctl restart [name.service]
# systemctl reload [name.service]
$ systemctl status [name.service]
# systemctl is-active [name.service]
enable
disable

To see the logs:

```
journalctl -fu pilothouse
```

If you don't see anything, then it's probably because the date/time on the board is not correct (no RTC battery backup). Get the correct date time with:

```
rdate wwv.nist.gov
```

## Setting up the Arduino

You'll need to download and install the Arduino IDE, along with the Sparkfun libraries that let the IDE talk to Sparkfun boards.

This page has that library:
[https://github.com/sparkfun/Arduino_Boards](https://github.com/sparkfun/Arduino_Boards)

Restart the IDE, and open up the `ma3toI2C.ino` file.

## Setting up the client

```
bower install
```


### Useful WiFi client commands
 
```
# list the current network status
sudo iwconfig
```


## Setting up the Edison for hotspot WiFi


### Useful WiFi hotspot commands

`sudo arp`: list hostapd clients

`sudo iwconfig`: list WiFi strength 


## Setting up Edison for WiFI client on boot with fallback to Hotspot

Still in development...


file `/etc/network/interfaces`

```
# start interfaces upon start of the system
auto lo wlan0
 
# register loopback interface
iface lo inet loopback

# use manual ip configuration for wlan0 interface and allow hotplug as well
allow-hotplug wlan0
iface wlan0 inet manual
```

file `/etc/rc.local`

```
#!/bin/bash

# Disable the Edison's watchdog.
echo 1 >/sys/devices/virtual/misc/watchdog/disable

# Based on http://lcdev.dk/2012/11/18/raspberry-pi-tutorial-connect-to-wifi-or-create-an-encrypted-dhcp-enabled-ad-hoc-network-as-fallback/

# RPi Network Conf Bootstrapper
 
createAdHocNetwork(){
    echo "Creating ad-hoc network"
    #ifconfig wlan0 down
    #iwconfig wlan0 mode ad-hoc
    #iwconfig wlan0 key aaaaa11111 #WEP key
    #iwconfig wlan0 essid RPi      #SSID
    #ifconfig wlan0 10.0.0.200 netmask 255.255.255.0 up
    #/usr/sbin/dhcpd wlan0
    echo "Ad-hoc network created"
}
 
echo "================================="
echo "Pilothouse WiFi Boot Setup"
echo "================================="
echo "Scanning for known WiFi networks"

echo "Attempting to connect to WiFi"
wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null 2>&1

if dhclient -1 wlan0
then
    echo "Connected to WiFi"
else
    echo "DHCP server did not respond with an IP lease (DHCPOFFER)"
    wpa_cli terminate
    createAdHocNetwork
fi
 
exit 0
```

## Webclient Port

Served on port 80 directly. We're already running as root, so why not?





## Manually Switch between connection and hotspot

Switch to client
```
sudo update-rc.d hostapd disable
sudo update-rc.d dnsmasq disable
sudo rm /etc/network/interfaces
sudo ln -s /etc/network/interfaces.client /etc/network/interfaces
sudo reboot
```

Switch to hotspot
```
sudo update-rc.d hostapd enable
sudo update-rc.d dnsmasq enable
sudo rm /etc/network/interfaces
sudo ln -s /etc/network/interfaces.hotspot /etc/network/interfaces
sudo reboot
```
