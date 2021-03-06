#!/bin/sh

# init.d script to start Apache Solr 

### BEGIN INIT INFO
# Provides:          solr
# Required-Start:    $remote_fs $network
# Required-Stop:     $remote_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6 
# Short-Description: starts Apache Solr
# Description:       Starts Apache Solr
### END INIT INFO


SOLR_USER=solr
PID_FILE=/var/run/solr.pid
SOLR_HOME=/opt/solr

do_start() {
  export SOLR_HOME

  cd $SOLR_HOME

  echo -n "Starting Solr ..."
  start-stop-daemon --start \
    --pidfile $PID_FILE \
    --chuid $SOLR_USER -d $SOLR_HOME \
    --background --make-pidfile \
    --startas /usr/bin/java \
    -- \
    -Dsolr.solr.home=$SOLR_HOME/solr \
    -Djetty.home=$SOLR_HOME \
    -Djava.io.tmpdir=/tmp \
    -jar $SOLR_HOME/start.jar \
    --daemon

  RC="$?"
  if [ "$RC" = 0 ]; then
    echo "OK"
  else
    echo "Failed"
  fi

  return $RC
}

do_stop() {
  echo -n "Stopping Solr ..."
  start-stop-daemon --stop --pidfile $PID_FILE 

  RC="$?"
  if [ "$RC" = 0 ]; then
    echo "OK"
  else
    echo "Failed"
  fi

  return $RC
}

COMMAND=$1

case "$COMMAND" in
start)
  do_start
  exit $RC
  ;;

stop)
  do_stop
  exit $RC
  ;;

restart)
  do_stop
  sleep 3
  do_start
  exit $RC
  ;;

*)
  echo "Usage: $0 {start|stop|restart}"
  exit 1
  ;;
esac

