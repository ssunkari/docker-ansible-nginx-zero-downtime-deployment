#!/bin/bash

# This script sets up dependencies and then builds and/or replaces one running ansible node.

# Exit on any error.
set -e
set +x

if [ "$1" = "" ] ; then
  echo "Usage $0 <target dir>"
  exit 1
fi

TARGET=$1

# Setup Python Virtul Env to avoid needing root privs and messing with system Python.
if [ ! -f "$TARGET/bin/activate" ] ; then
  if uname -a | grep Linux > /dev/null ; then
    sudo apt-get update
    sudo apt-get -y install python-virtualenv python-dev libyaml-dev libffi-dev python-cffi libssl-dev
  else
      if ! which virtualenv 2>&1 > /dev/null; then
          echo "Can't find virtualenv, please install python with virtualenv"
          exit 418
      fi
  fi
  mkdir -p "$TARGET" || true
  virtualenv -p /usr/bin/python "$TARGET"
  . "$TARGET"/bin/activate
  # Install seperately for ease of debugging
  pip install -U setuptools
  pip install boto
  pip install boto3
  pip install 'ansible>=2.0.0'
fi

exit 0
