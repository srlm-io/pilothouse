#!/usr/bin/env bash

ssh-keygen -f ~/.ssh/pilothouse.rsa -t rsa -N ''
chmod 600 ~/.ssh/pilothouse.rsa
SSH_KEY="$(cat ~/.ssh/pilothouse.rsa.pub)"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/pilothouse.rsa

echo "Host pilothouse.local" >> ~/.ssh/config
echo "    IdentityFile ~/.ssh/pilothouse.rsa" >> ~/.ssh/config
chmod 600 ~/.ssh/config

ssh root@pilothouse.local /usr/bin/env bash << EOF
    echo "${SSH_KEY}" >> /home/root/.ssh/authorized_keys
EOF

rsync -au --verbose --delete --exclude 'node_modules' --exclude '.idea' --exclude '.git' ./ root@pilothouse.local:pilothouse

ssh root@pilothouse.local /usr/bin/env bash < provision.remote.sh