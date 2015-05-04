# node-red-contrib-zibase

Input Node for NODE-RED which will configure itself to listen on UDP port for all Zibase events.
Uses ZAPI 1, cf [http://www.zodianet.com/zapi.html](http://www.zodianet.com/zapi.html)

Based on original code from : [https://github.com/onlinux/Zibase-log](https://github.com/onlinux/Zibase-log)

**Works only if Node-Red server runs on same network as Zibase.**
**Make sure your Node-Red server firewall allows incoming UDP packets on port 17100 !**

You only need to configure local IP address of Zibase box.

Puts the received messages in msg.payload

Parses additional info such as :

* msg.id
* msg.level
* msg.temperature
* msg.humidity
* msg.rf
* msg.device

Only tested on ZIBASE Classic : [http://www.zodianet.com/toolbox-zibase/zibase-classic.html](http://www.zodianet.com/toolbox-zibase/zibase-classic.html)
