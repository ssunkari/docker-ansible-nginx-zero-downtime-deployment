#!/bin/bash -eux

# change the directory to /usr/lib/www
cd /usr/src/www

#set the environment variable to avoid having client and server having different version complaints
# sudo export COMPOSE_API_VERSION=1.18

# Build the new image, or pull it from a repo.
docker-compose pull

#Start the Nginx proxy if its not ready
docker ps | grep proxy > /dev/null || docker-compose up -d proxy

# Shut down Service A first, and restart with new image
docker-compose stop service_a
docker-compose up -d --force-recreate service_a

# Wait a little in case the service takes a bit to start
sleep 5

# Now shut down and restart Service B with new image.
docker-compose stop service_b
docker-compose up -d --force-recreate service_b
