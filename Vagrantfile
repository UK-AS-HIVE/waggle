# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 8983, host: 8983

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
    # Customize the amount of memory on the VM:
    vb.memory = "1536"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision :shell, :privileged => false, :inline => <<-SHELL
    sudo apt-get update
    echo 'mysql-server mysql-server/root_password password waggle' | sudo debconf-set-selections
    echo 'mysql-server mysql-server/root_password_again password waggle' | sudo debconf-set-selections
    sudo apt-get -y install git-core unzip
    sudo apt-get -y install mysql-server mysql-client
    sudo apt-get -y install php5-cli php5-common php5-mysql php5-gd php5-curl php5 libapache2-mod-php5
    sudo apt-get -y install apache2

    sudo a2enmod rewrite
  SHELL

  config.vm.provision "file", source: "~/.gitconfig", destination: ".gitconfig"
  config.vm.provision "file", source: "vagrant/apachesite.conf", destination: "000-default.conf"

  config.vm.provision :shell, :privileged => false, :inline => <<-SHELL
    sudo mv 000-default.conf /etc/apache2/sites-available/000-default.conf
    sudo service apache2 restart

    curl -sS https://getcomposer.org/installer | php
    
    ./composer.phar global require drush/drush:6.*
    ./composer.phar global require zendframework/zendframework1:1.*

    export PATH="$HOME/.composer/vendor/bin:$PATH"
    echo export PATH="$HOME/.composer/vendor/bin:$PATH" >> ~/.bashrc

    drush dl drupal-7.x --drupal-project-rename -y
    sudo rm -rf /var/www/
    sudo mv drupal /var/www

    cd /var/www/sites/all/modules/

    echo "create database waggle" | mysql -uroot -pwaggle
    drush site-install standard -y --account-name=admin --account-pass=admin --db-url=mysql://root:waggle@localhost/waggle

    git clone https://github.com/UK-AS-HIVE/waggle -b updating
    ln -s /var/www/sites/all/modules/waggle/waggle_theme/ ../themes/waggle_theme
    cd waggle/waggle_theme
    git clone https://github.com/UK-AS-HIVE/full_name_field full_name
    drush dl features_extra
    drush dl fontawesome
    drush en -y fontawesome
    drush fa-download
    drush en -y waggle_feature waggle waggle_tracker

    drush dl-autopager

    cd /var/www/sites/all/modules/editablefields
    #wget https://www.drupal.org/files/editablefields-stale-entity-in-form-state.patch
    #wget https://www.drupal.org/files/editablefields-1206656-65.patch
    patch -p1 < /vagrant/vagrant/editablefields.patch

    drush vset site_name "Waggle"
    drush en -y waggle_theme
    drush vset theme_default waggle_theme

    drush dl devel
    drush en -y devel
    drush dis -y overlay

    sudo chown -R :www-data /var/www
  SHELL

  config.vm.provision :shell, :privileged => false, :inline => <<-SHELL
    #sudo apt-get -y install openjdk-7-jdk
    #mkdir /usr/java
    #ln -s /usr/lib/jvm/java-7-openjdk-amd64 /usr/java/default
    #sudo apt-get install -y default-jre-headless
    sudo apt-get install -y openjdk-7-jre-headless
    
    cd /tmp
    if [[ ! -d /opt/solr ]]
    then
      #wget -qO- http://archive.apache.org/dist/lucene/solr/4.7.2/solr-4.7.2.tgz
      #curl http://archive.apache.org/dist/lucene/solr/4.7.2/solr-4.7.2.tgz > solr-4.7.2.tgz
      wget http://archive.apache.org/dist/lucene/solr/4.7.2/solr-4.7.2.tgz --progress=bar:force 2>&1 | tail -f -n +6
      tar -xvf solr-4.7.2.tgz
      sudo cp -R solr-4.7.2/example /opt/solr

      cd /opt/solr/solr/collection1/conf
      sudo cp /var/www/sites/all/modules/search_api_solr/solr-conf/4.x/* .

      sudo useradd -d /opt/solr -M -s /dev/null -U solr
      sudo chown -R solr:solr /opt/solr
    fi

  SHELL

  config.vm.provision "file", source: "vagrant/solr-init.d.sh", destination: "solr-init.d.sh"
  config.vm.provision :shell, :privileged => false, :inline => <<-SHELL
    sudo chmod +x solr-init.d.sh
    sudo mv solr-init.d.sh /etc/init.d/solr
    sudo update-rc.d solr defaults

    sudo /etc/init.d/solr start
  SHELL

end

