#!/usr/bin/env bash

apt-get update

###########################################################
# Install Applications
###########################################################
echo "-------------------------------------------------------------------------"
echo " Installing Base Packages"
echo "-------------------------------------------------------------------------"
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
apt-get install --yes git
apt-get install --yes vim
apt-get install --yes nodejs
apt-get install --yes build-essential
apt-get install --yes mongodb
apt-get install --yes postgresql postgresql-contrib
apt-get install --yes phantomjs

# install python modules for dados-pygen
echo "-------------------------------------------------------------------------"
echo " Installing Python Modules"
echo "-------------------------------------------------------------------------"
apt-get install --yes python-setuptools
easy_install requests fake-factory

# install node modules
echo "-------------------------------------------------------------------------"
echo " Installing Global Node Modules"
echo "-------------------------------------------------------------------------"
su - vagrant -c 'sudo npm install -g node-gyp;
sudo npm install -g http-server;
sudo npm install -g forever;
sudo npm install -g grunt-cli;
sudo npm install -g karma;
sudo npm install -g bower;
sudo npm install -g sails'

# Symlink node_modules to get around windows restrictions
# See http://perrymitchell.net/article/npm-symlinks-through-vagrant-windows/
echo "-------------------------------------------------------------------------"
echo " Creating Symlinks"
echo "-------------------------------------------------------------------------"
su - vagrant -c 'mkdir ~/node_modules_dados;
rm -rf /vagrant/node_modules;
cd /vagrant;
ln -s ~/node_modules_dados node_modules;
sudo chown -R vagrant ~/.npm/_locks'

echo "-------------------------------------------------------------------------"
echo " Configuring PostgreSQL"
echo "-------------------------------------------------------------------------"
# Edit the following to change the name of the database user that will be created:
APP_DB_USER='postgres'
APP_DB_PASS='password'

# Edit the following to change the name of the database that is created (defaults to the user name)
APP_DB_NAME='dados_dev'

# Edit the following to change the version of PostgreSQL that is installed
PG_VERSION=9.4

###########################################################
# Changes below this line are probably not necessary
###########################################################
print_db_usage () {
  echo "Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 15432)"
  echo "  Host: localhost"
  echo "  Port: 15432"
  echo "  Database: $APP_DB_NAME"
  echo "  Username: $APP_DB_USER"
  echo "  Password: $APP_DB_PASS"
  echo ""
  echo "Admin access to postgres user via VM:"
  echo "  vagrant ssh"
  echo "  sudo su - postgres"
  echo ""
  echo "psql access to app database user via VM:"
  echo "  vagrant ssh"
  echo "  sudo su - postgres"
  echo "  PGUSER=$APP_DB_USER PGPASSWORD=$APP_DB_PASS psql -h localhost $APP_DB_NAME"
  echo ""
  echo "Env variable for application development:"
  echo "  DATABASE_URL=postgresql://$APP_DB_USER:$APP_DB_PASS@localhost:15432/$APP_DB_NAME"
  echo ""
  echo "Local command to access the database via psql:"
  echo "  PGUSER=$APP_DB_USER PGPASSWORD=$APP_DB_PASS psql -h localhost -p 15432 $APP_DB_NAME"
}

export DEBIAN_FRONTEND=noninteractive

PROVISIONED_ON=/etc/vm_provision_on_timestamp
if [ -f "$PROVISIONED_ON" ]
then
  echo "VM was already provisioned at: $(cat $PROVISIONED_ON)"
  echo "To run system updates manually login via 'vagrant ssh' and run 'apt-get update && apt-get upgrade'"
  echo ""
  print_db_usage
  exit
fi

PG_REPO_APT_SOURCE=/etc/apt/sources.list.d/pgdg.list
if [ ! -f "$PG_REPO_APT_SOURCE" ]
then
  # Add PG apt repo:
  echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" > "$PG_REPO_APT_SOURCE"

  # Add PGDG repo key:
  wget --quiet -O - https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
fi

# Update package list and upgrade all packages
apt-get update
apt-get -y upgrade

apt-get -y install "postgresql-$PG_VERSION" "postgresql-contrib-$PG_VERSION"

PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PG_DIR="/var/lib/postgresql/$PG_VERSION/main"

# Edit postgresql.conf to change listen address to '*':
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

# Append to pg_hba.conf to add password auth:
echo "host    all             all             all                     md5" >> "$PG_HBA"

# Explicitly set default client_encoding
echo "client_encoding = utf8" >> "$PG_CONF"

# Restart so that all new config is loaded:
service postgresql restart

cat << EOF | su - postgres -c psql
-- Create the database user:
ALTER USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';

-- Create the database:
CREATE DATABASE $APP_DB_NAME WITH OWNER=$APP_DB_USER
                                  LC_COLLATE='en_US.utf8'
                                  LC_CTYPE='en_US.utf8'
                                  ENCODING='UTF8'
                                  TEMPLATE=template0;
EOF

# Tag the provision time:
date > "$PROVISIONED_ON"

echo "Successfully created PostgreSQL dev virtual machine."
echo ""
print_db_usage
