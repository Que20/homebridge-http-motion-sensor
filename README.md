# homebridge-http-motion-sensor

This is a plugin for homebridge which can monitor a motion sensor via a HTTP endpoint.
The endpoint shall return a 0 or 1 value depending on the sensor state.

This project is heavily inspired by cyakimov's [homebridge-http-contact-sensor](https://github.com/cyakimov/homebridge-http-contact-sensor)

## Install

Previous installation of [Homebridge](https://github.com/nfarina/homebridge) is required.

Then run the following command to install `homebridge-http-motion-sensor`

```
npm install -g npm install -g homebridge-http-pir-motion-sensor
```

## Configuration

To add to your `config.json` file, under the `accessories` array :
```json
{
    "accessory": "motion-sensor",
    "name": "Hallway",
    "pollInterval": 500,
    "statusUrl": "http://localhost/sensor"
}
```

| Parameter     | Type   | Value                                                                  |
| ------------- |--------|------------------------------------------------------------------------|
| accessory     | String | Must be `motion-sensor`.                                               |
| name          | String | The name that will be displayed in HomeKit for the accessory.          |
| pollInterval  | Double | The interval for requesting the status url.                            |
| statusUrl     | String | The url that will returns the status of the motion sensor (0 or 1).    |


You can add as many accessories as needed.

## Thanks

To [cyakimov](https://github.com/cyakimov/) and the project [homebridge-http-contact-sensor](https://github.com/cyakimov/homebridge-http-contact-sensor)

## Contribute

Pull requests are open ;)
