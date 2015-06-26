#! /bin/bash

# Script that runs after the watch command has rsynced files


sudo rm /etc/monit/monitrc
sudo cp /home/pilothouse/pilothouse/monitrc /etc/monit
sudo chown root:root /etc/monit/monitrc
sudo chmod 0700 /etc/monit/monitrc

# If monitrc changed then we need to restart monit!


sudo monit restart pilothoused
