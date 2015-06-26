# pilothouse

Pilothouse is a project to build an autonomous sailboat using Node.js on the Intel Edison.


# Hardware



# Software

- Node.js


wget http://nodejs.org/dist/v0.12.5/node-v0.12.5.tar.gz
tar -zxf node-v0.12.5.tar.gz
cd node-v0.12.5
./configure && make -j 3 && sudo make install

cd /usr/bin
sudo ln -s /usr/local/bin/node

sudo visudo
pilothouse ALL=(ALL) NOPASSWD: ALL


sudo npm install -g forever

cd /etc/init.d
sudo ln -s ~/pilothouse/pilothoused
cd ~


sudo apt-get install monit

sudo rm /etc/monit/monitrc
sudo cp /home/pilothouse/pilothouse/monitrc /etc/monit
sudo chown root:root /etc/monit/monitrc
sudo chmod 0700 /etc/monit/monitrc

sudo apt-get install sqlite3



# Taken from http://raspberrypi.stackexchange.com/a/5341
sudo apt-get install ifplugd
sudo mv /etc/ifplugd/action.d/ifupdown /etc/ifplugd/action.d/ifupdown.original
sudo cp /etc/wpa_supplicant/ifupdown.sh /etc/ifplugd/action.d/ifupdown




```
# Format an external USB disk
sudo mkfs -t ext4 /dev/mmcblk1

# Mount external USB disk
sudo mkdir -p /media/flash
sudo mount /dev/mmcblk1 /media/flash
sudo chown -R ${USER}:${GROUP} /media/flash
echo "/dev/mmcblk1 /media/flash ext4 defaults 1 2" | sudo tee -a /etc/fstab
```



# Setting up the Arduino

You'll need to download and install the Arduino IDE, along with the Sparkfun libraries that let the IDE talk to Sparkfun boards.

This page has that library:
https://github.com/sparkfun/Arduino_Boards

Restart the IDE, and open up the .ino file.




# Port
Served on port 80 directly. We're already running as root, so why not?





# Setting up the Edison WiFi


Helpful Commands

```
# list the current network status
sudo iwconfig


$ cat /etc/wpa_supplicant/wpa_supplicant.conf 
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
	ssid="srlm"
	psk="d6a09fd14e4e"
	priority=3
}

network={
	ssid="srlmbase"
	psk="wsxedcrfv"
	priority=2
}

network={
	ssid="srlmmobile"
	psk="wsxedcrfv"
	priority=1
}

# This file will allow the wifi to automatically reconnect and switch between networks
$ sudo cat /etc/network/interfaces 
auto lo 

iface lo inet loopback 
iface eth0 inet dhcp 

allow-hotplug wlan0 
iface wlan0 inet manual 
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf 
iface default inet dhcp


```



# Setting up hostapd
https://nims11.wordpress.com/2012/04/27/hostapd-the-linux-way-to-create-virtual-wifi-access-point/
https://communities.intel.com/message/284453
http://www.cyberciti.biz/faq/debian-ubuntu-linux-setting-wireless-access-point/

-------------------------------------------------------------------------



/etc/hostapd/hostapd.conf
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

/etc/default/hostapd
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```



Install:
```
sudo apt-get install hostapd zd1211-firmware dnsmasq
sudo update-rc.d hostapd enable
sudo update-rc.d dnsmasq enable

```

/etc/dnsmasq.conf
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

/etc/hosts.dnsmasq
```
172.16.0.1 ubilinux
```
