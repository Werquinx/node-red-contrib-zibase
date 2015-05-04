# node-red-contrib-zibase

Input Node for NODE-RED which will configure itself to listen on UDP port for all Zibase events.
Uses ZAPI 1, cf http://www.zodianet.com/zapi.html

Works only if Node-Red server runs on same network as Zibase

Puts the received messages in msg.payload

Parses additional info such as :
msg.id
msg.level
msg.temperature
msg.humidity
msg.rf

Only tested on ZIBASE Classic : http://www.zodianet.com/toolbox-zibase/zibase-classic.html
