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
sudo apt-get install hostapd zd1211-firmware dnsmasq
sudo update-rc.d hostapd enable
sudo update-rc.d dnsmasq enable

```

### Useful WiFi hotspot commands

`sudo arp`: list hostapd clients

`sudo iwconfig`: list WiFi strength 

## Webclient Port

Served on port 80 directly. We're already running as root, so why not?