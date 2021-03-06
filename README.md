Waggle
======

[![Build Status](https://travis-ci.org/UK-AS-HIVE/waggle.svg?branch=master)](https://travis-ci.org/UK-AS-HIVE/waggle)

Waggle is a set of modules to transform Drupal into a powerful ticketing system.

Waggle's architecture provides:
  * E-mail integration
  * Search-driven interfaces
  * Analytics
  * Hashtags
  * Global change tracker
  * Group-guided estimation (TODO)
  * Calendar and timeline (TODO)

API
===

POST waggle/api/remote-add
----------------------------

Creates a new story in the help tracker.

###### Required parameters:

username  
email  
description  
ip_address  

###### Optional parameters:

submitted_by (deprecated - use on_behalf_of instead)
on_behalf_of - user name of the person the request is for, which will become the author of the story node
location
phone
tags - list of tag names, without hash sign, which should be set on the story.  separate tags with semicolon or newlines.
associate - list of user names to add to associated users.  separate names with semicolon or newlines.
role_visibility - role names which should be able to view this story.  separate role names with semicolon or newlines.
tags - list of tag names, without hash sign, which should be set on the story.  separate tags with semicolon or newlines.  
associate - list of user names to add to associated users.  separate names with semicolon or newlines.  
role_visibility - role names which should be able to view this story.  separate role names with semicolon or newlines.  


Development
===========

The easiest way to get started is using Vagrant.

    $ git clone https://github.com/UK-AS-HIVE/waggle/
    $ cd waggle/
    $ vagrant up
    ... install ...
    $ vagrant ssh
    $ cd /var/www/sites/all/modules/waggle

It will take several minutes to download dependencies and install.  Then, navigate to http://localhost:8080/ on your
host machine.  Login using 'admin/admin'.

