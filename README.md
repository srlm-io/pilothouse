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


## Intel Edison (Ubilinux)


```bash
# We don't really want to put in a password for every sudo...
sudo visudo
pilothouse ALL=(ALL) NOPASSWD: ALL

# Build and install the latest version of node
wget http://nodejs.org/dist/v0.12.5/node-v0.12.5.tar.gz
tar -zxf node-v0.12.5.tar.gz
cd node-v0.12.5
./configure && make -j 3 && sudo make install
cd /usr/bin
sudo ln -s /usr/local/bin/node

# Create a daemon for pilothouse
cd /etc/init.d
sudo ln -s ~/pilothouse/pilothoused
cd ~

# And a monitoring system to make sure it stays up
sudo apt-get install monit
sudo rm /etc/monit/monitrc
sudo cp /home/pilothouse/pilothouse/monitrc /etc/monit
sudo chown root:root /etc/monit/monitrc
sudo chmod 0700 /etc/monit/monitrc

# We'll need a place to store our data logs
sudo apt-get install sqlite3



# Format an external USB disk
sudo mkfs -t ext4 /dev/mmcblk1

# Mount external USB disk
sudo mkdir -p /media/flash
sudo mount /dev/mmcblk1 /media/flash
sudo chown -R ${USER}:${GROUP} /media/flash
echo "/dev/mmcblk1 /media/flash ext4 defaults 1 2" | sudo tee -a /etc/fstab
```



## Setting up the Arduino

You'll need to download and install the Arduino IDE, along with the Sparkfun libraries that let the IDE talk to Sparkfun boards.

This page has that library:
[https://github.com/sparkfun/Arduino_Boards](https://github.com/sparkfun/Arduino_Boards)

Restart the IDE, and open up the `ma3toI2C.ino` file.

## Setting up the Edison for client WiFi

```
# Automatically reconnect WiFi (as a client) if we loose connection
# Taken from http://raspberrypi.stackexchange.com/a/5341
sudo apt-get install ifplugd
sudo mv /etc/ifplugd/action.d/ifupdown /etc/ifplugd/action.d/ifupdown.original
sudo cp /etc/wpa_supplicant/ifupdown.sh /etc/ifplugd/action.d/ifupdown

```

Setting up interfaces this way will allow the wifi to automatically reconnect and switch between networks
file `/etc/network/interfaces`

```
auto lo 

iface lo inet loopback 
iface eth0 inet dhcp 

allow-hotplug wlan0 
iface wlan0 inet manual 
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf 
iface default inet dhcp
```


file `/etc/wpa_supplicant/wpa_supplicant.conf`

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
	ssid="networkA"
	psk="password"
	priority=3
}

network={
	ssid="networkB"
	psk="password"
	priority=2
}

network={
	ssid="networkC"
	psk="password"
	priority=1
}
```

### Useful WiFi client commands
 
```
# list the current network status
sudo iwconfig
```


## Setting up the Edison for hotspot WiFi

```bash
sudo apt-get install hostapd zd1211-firmware dnsmasq
```


file `/etc/network/interfaces`

```
auto lo

iface lo inet loopback
iface eth0 inet dhcp

iface wlan0 inet static
address 172.16.0.1
netmask 255.255.255.0
```


file `/etc/hostapd/hostapd.conf`

```
# interface used by access point
interface=wlan0

# firmware driver
driver=nl80211

# access point SSID
ssid=pilothouse

# operation mode (a = IEEE 802.11a, b = IEEE 802.11b, g = IEEE 802.11g)
hw_mode=g

# access point channel
channel=3

macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0

# key management algorithm
wpa_key_mgmt=WPA-PSK
wpa_passphrase=wsxedcrfv
wpa=2

# set ciphers
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

file `/etc/default/hostapd`

```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```


file `/etc/dnsmasq.conf`

```
log-facility=/var/log/dnsmasq.log
address=/#/172.16.0.1
interface=wlan0
dhcp-range=172.16.0.2,172.16.0.250,12h
no-resolv
no-hosts
addn-hosts=/etc/hosts.dnsmasq
log-queries
```

file `/etc/hosts.dnsmasq`

```
172.16.0.1 ubilinux
```

Commands to setup hotspot:

```bash
sudo update-rc.d hostapd enable
sudo update-rc.d dnsmasq enable

```

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
