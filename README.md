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


$ sudo cat /etc/network/interfaces 
# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

#auto usb0
iface usb0 inet static
    address 192.168.2.15
    netmask 255.255.255.0

# SRLM changes 2015-06-15
allow-hotplug wlan0
auto wlan0
iface wlan0 inet dhcp
pre-up wpa_supplicant -Dwext -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf -B

# And the following 4 lines are for when using hostapd...
#auto wlan0
#iface wlan0 inet static
#    address 192.168.42.1
#    netmask 255.255.255.0


```



# Setting up hostapd
https://nims11.wordpress.com/2012/04/27/hostapd-the-linux-way-to-create-virtual-wifi-access-point/
https://communities.intel.com/message/284453
http://www.cyberciti.biz/faq/debian-ubuntu-linux-setting-wireless-access-point/






