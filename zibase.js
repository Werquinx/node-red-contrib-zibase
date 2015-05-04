/// <reference path="typings/node/node.d.ts"/>
module.exports = function (RED) {

    //var config = require('./config');
    var dgram = require('dgram');

    function ZibaseNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.ZibaseIP = config.ZibaseIP;
  





        //var _ = require('underscore');
        //var request = require("request");
        var S = require('string');


        var clientIp = process.env.MYIP || getIPAddress();
        var zibaseIp = config.ZibaseIP || "192.168.0.250";
        //node.warn(clientIp);
        //node.log("config.zibaseIp : " + config.zibaseIp);

        //var moment = require('moment');
        //var dateFormat = "MMM DD YYYY HH:mm:ss";
        //var home;
        //var probes = [];
        //var actuators = [];
        //var sensors = [];
        //var scenarios = [];
        //var cameras = [];
        //var variables = [];
        //var debug = config.debug || false;



        var server = dgram.createSocket("udp4");
        var client = dgram.createSocket("udp4");

        var b = new Buffer(70);
        b.fill(0);
        b.write('ZSIG\0', 0/*offset*/);
        b.writeUInt16BE(13, 4); //command HOST REGISTERING (13)
        b.writeUInt32BE(dot2num(clientIp), 50); //Ip address
        b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC

        //this.warn(b);
        //this.warn(b.toString('hex', 0, b.length));

        server.on("error", function (err) {
            node.status({});
            server.close();
            node.error("Zibase Server error:\n" + err.stack);
        });

        server.on("message", function (msg, rinfo) {
            //var date = moment();
            msg = msg.slice(70);
            msg = msg.toString();
            var message = {};

            if (S(msg).contains('Zapi linked')) {

                node.status({ fill: "green", shape: "dot", text: "Listening" });

            }
            message.id = S(msg).between('<id>', '</id>').s;
            message.rf = S(msg).between('<rf>', '</rf>').s;
            message.level = S(msg).between('<lev>', '</lev>').toFloat();
            message.device = S(msg).between('<dev>', '</dev>').s;
            message.temperature = S(msg).between('<tem>', '</tem>').toFloat();
            message.humidity = S(msg).between('<hum>', '</hum>').toInt();
            message.battery = S(msg).between('<bat>', '</bat>').s;                        
            //if (!debug) {
            msg = msg.replace(/<(?:.|\n)*?>/gm, ''); // delete all html tags
            //}


            message.payload = S(msg).chompRight('\u0000').s;
            node.send(message);
            
            //node.warn(date.format(dateFormat) + " " + msg);
        });

        server.on("listening", function () {
            var address = server.address();
            //node.warn("Server listening " + address.address + ":" + address.port);
            node.status({fill:"green",shape:"dot",text:"Connecting (" + zibaseIp + ":" + address.port + ")"});
            //node.status({fill:"green",shape:"dot",text:"Listening from"});
        });

        client.send(b, 0, b.length, 49999, zibaseIp, function (err, bytes) {
            client.close();
        });

        server.bind(0x42CC, clientIp);


        this.on('close', function (done) {
            node.status({});
            node.log("Closing Zibase connection");
            server.close();
            var client = dgram.createSocket("udp4");
            b.writeUInt16BE(22, 4); //command HOST UNREGISTERING (22)
            //node.warn(b);
            //node.log("Unregistering...");
            client.send(b, 0, b.length, 49999, zibaseIp, function (err, bytes) {
                client.close();
            });
            done();
            //node.log("Exit...");
        });










    }
    RED.nodes.registerType("Zibase", ZibaseNode);
};




function dot2num(dot) {
    var d = dot.split('.');
    return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

    return '0.0.0.0';
}