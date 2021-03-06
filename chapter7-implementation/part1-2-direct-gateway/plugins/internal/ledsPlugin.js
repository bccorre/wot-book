var resources = require('./../../resources/model');

var actuator, actuator1, actuator2, actuator3, interval;
var model = resources.pi.actuators.leds['1'];
var model1 = resources.pi.actuators.leds['2'];
var model2 = resources.pi.actuators.leds['3'];
var model3 = resources.pi.actuators.leds['4'];
var pluginName = model.name;
var pluginName1 = model1.name;
var pluginName2 = model2.name;
var pluginName3 = model3.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  observe(model); //#A
  observe1(model1);
  observe2(model2);
  observe3(model3);

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
    actuator1.unexport();
    actuator2.unexport();
    actuator3.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
  console.info('%s plugin stopped!', pluginName1);
  console.info('%s plugin stopped!', pluginName2);
  console.info('%s plugin stopped!', pluginName3);
};

function observe(what) {
  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName);
    switchOnOff(model.value); //#B
  });
};

function observe1(what) {
  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName1);
    switchOnOff1(model1.value); //#B
  });
};

function observe2(what) {
  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName2);
    switchOnOff2(model2.value); //#B
  });
};

function observe3(what) {
  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName3);
    switchOnOff3(model3.value); //#B
  });
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName, value);
    });
  }
};

function switchOnOff1(value) {
  if (!localParams.simulate) {
    actuator1.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName1, value);
    });
  }
};

function switchOnOff2(value) {
  if (!localParams.simulate) {
    actuator2.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName2, value);
    });
  }
};

function switchOnOff3(value) {
  if (!localParams.simulate) {
    actuator3.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName3, value);
    });
  }
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName, value);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(model.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName);

  var Gpio1 = require('onoff').Gpio;
  actuator1 = new Gpio1(model1.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName1);

  var Gpio2 = require('onoff').Gpio;
  actuator2 = new Gpio2(model2.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName2);

  var Gpio3 = require('onoff').Gpio;
  actuator3 = new Gpio3(model3.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName3);
};

function simulate() {
  interval = setInterval(function () {
    // Switch value on a regular basis
    if (model.value) {
      model.value = false;
      model1.value = false;
      model2.value = false;
      model3.value = false;
    } else {
      model.value = true;
      model1.value = true;
      model2.value = true;
      model3.value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
  console.info('Simulated %s actuator started!', pluginName1);
  console.info('Simulated %s actuator started!', pluginName2);
  console.info('Simulated %s actuator started!', pluginName3);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode
