#!/usr/bin/env bash

opkg update
opkg install sqlite3

# The default bundled busybox tar had some troubles with extracting the 5.1.0 nodejs
opkg install tar

opkg remove --force-removal-of-dependent-packages nodejs
# Build and install the latest version of node
NODE_VERSION=node-v5.1.0
if [ ! -d ${NODE_VERSION} ] ; then
    wget http://nodejs.org/dist/latest-v5.x/${NODE_VERSION}.tar.gz
    tar -zxf ${NODE_VERSION}.tar.gz
fi

cd ${NODE_VERSION}
./configure && make -j 3 && make install
ln -s /usr/local/bin/node /usr/local/bin/nodejs
chmod +x /usr/local/bin/nodejs

cd /home/root/pilothouse
npm config set production
npm install

#mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.old
#mv /etc/hostapd/udhcpd-for-hostapd.conf /etc/hostapd/udhcpd-for-hostapd.conf.old
cp /home/root/pilothouse/system/hostapd.conf /etc/hostapd/hostapd.conf
cp /home/root/pilothouse/system/udhcpd-for-hostapd.conf /etc/hostapd/udhcpd-for-hostapd.conf

systemctl disable wpa_supplicant.service
systemctl enable hostapd.service

cp /home/root/pilothouse/system/pilothouse.service /lib/systemd/system/
systemctl enable pilothouse.service

mkdir /settings

# Format an external USB disk
#mkfs -t ext4 /dev/mmcblk1

## Mount external USB disk
#mkdir -p /media/flash
#mount /dev/mmcblk1 /media/flash
#chown -R ${USER}:${GROUP} /media/flash
#echo "/dev/mmcblk1 /media/flash ext4 defaults 1 2" | sudo tee -a /etc/fstab

