mkdir -p /usr/src/lib
chown /usr/src/lib root:root

export COMPOSE_API_VERSION=1.18

if ! hash pip 2>/dev/null; then
			echo "Installing pip"
			wget https://bootstrap.pypa.io/get-pip.py
			sudo python get-pip.py
fi

if ! hash curl 2>/dev/null; then
			echo "Installing curl"
			sudo apt-get install -y curl
fi

if ! hash docker 2>/dev/null; then
			echo "Installing docker"
			curl -sSL https://get.docker.com/ | sudo sh
fi

if ! hash docker-compose 2>/dev/null; then
			echo "Installing docker-compose"
			sudo pip install docker-compose --upgrade
fi

# if ! hash node 2>/dev/null; then
# 			echo "Installing Node V4.4.6"
# 			sudo pip install docker-compose --upgrade
# fi