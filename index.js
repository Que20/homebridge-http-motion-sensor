const http = require('http');

var Service, Characteristic, ContactState, Homebridge;

module.exports = function (homebridge) {
        Service = homebridge.hap.Service
        Characteristic = homebridge.hap.Characteristic
        Homebridge = homebridge
        homebridge.registerAccessory("homebridge-http-motion-sensor", "motion-sensor", MotionSensorAccessory)
}

function MotionSensorAccessory(log, config) {
        this.log = log;
        this.name = config.name;
        this.pollInterval = config.pollInterval;
        this.statusUrl = config.statusUrl || null;

        if (this.statusUrl == null) {
                this.log("statusUrl is required");
                process.exit(1);
        }

        this.detecting = true;
        this.wasDetecting = true;

        this.service = new Service.MotionSensor(this.name);
        setTimeout(this.monitorMotionSensorState.bind(this), this.pollInterval);
};

MotionSensorAccessory.prototype = {
        identify: function (callback) {
                callback(null);
        },

        monitorMotionSensorState: function () {
                this.checkMotion((state) => {
                        this.detecting = state;
                        if (this.detecting != this.wasDetecting) {
                                this.wasDetecting = this.detecting;
                                this.service.getCharacteristic(Characteristic.MotionDetected).setValue(this.detecting);
                        }
                        setTimeout(this.monitorMotionSensorState.bind(this), this.pollInterval);
                })
        },

        checkMotion: function (callback) {
                if (this.statusUrl != null) {
                        http.get(this.statusUrl, (resp) => {
                                let data = '';
                                resp.on('data', (chunk) => {
                                        data += chunk;
                                });
                                resp.on('end', () => {
                                        callback(parseInt(data));
                                });
                        }).on("error", (err) => {
                                console.error("Error: " + err.message);
                                callback();
                        });
                }
        },

        getMotionDetected: function (callback) {
                this.checkMotion((state) => {
                        this.detecting = state;
                        this.log("getContactSensorState: ", this.detecting);
                        callback(null, this.detecting);
                });
        },

        getName: function (callback) {
                callback(null, this.name);
        },

        getServices: function () {
                var informationService = new Service.AccessoryInformation();

                informationService
                        .setCharacteristic(Characteristic.Manufacturer, "ContactSensor")
                        .setCharacteristic(Characteristic.Model, "FrontDoor")
                        .setCharacteristic(Characteristic.SerialNumber, "Version 1.0.3");

                this.service
                        .getCharacteristic(Characteristic.MotionDetected)
                        .on('get', this.getMotionDetected.bind(this));

                this.service
                        .getCharacteristic(Characteristic.Name)
                        .on('get', this.getName.bind(this));

                return [informationService, this.service];
        }
};