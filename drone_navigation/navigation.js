
// import libraries

var arDrone = require('ar-drone');
var autonomy = require('ardrone-autonomy');
var client = arDrone.createClient();
var ctrl    = new autonomy.Controller(client, {debug: false});
client.config('general:navdata_demo', 'FALSE');

// enable navigaton data for client

function setNavDataHook(hook) {
  if (navDataHook) {
    client.removeListener('navdata', navDataHook);
    navDataHook = null;
  }
  if (hook) {
    client.on('navdata', hook);
    navDataHook = hook;
  }
}


// Utilizes odometry tracker
 
var Odometry = function(client) {
  this.client = client;
  this.start_x = null;
  this.start_y = null;
  this.x = null;
  this.y = null;
  this.hook = null;
};


// Starts odometry.
 
Odometry.prototype.start = function() {
  if (this.hook) {
    this.stop();
  }
  this.start_x = null;
  this.start_y = null;
  this.x = null;
  this.y = null;
  this.client.config('general:navdata_demo', 'FALSE');
  var self = this;
  this.hook = function(navData) {
    self.handleNavData_(navData);
  };
  this.client.on('navdata', this.hook);
};


// Stop odometry

Odometry.prototype.stop = function() {
  this.client.config('general:navdata_demo', 'TRUE');
  this.client.removeListener('navdata', this.hook);
};


// Event handling
Odometry.prototype.handleNavData_ = function(navData) {
  if (navData.demo) {
    var translation = navData.demo.client.camera.translation;
    if (this.start_x === null || this.start_y === null) {
      this.start_x = translation.x;
      this.start_y = translation.y;
    } else {
      this.x = translation.x;
      this.y = translation.y;
    }
  }
};


// Uses distance formula to compute distance traveled
Odometry.prototype.distance = function() {
  if (this.start_x !== null & this.start_y !== null &&
      this.x !== null && this.y !== null) {
    var dx = this.x - this.start_x;
    var dy = this.y - this.start_y;
    return Math.sqrt(dx * dx + dy * dy);
  } else {
    return 0.0;
  }
};


// Initialize odometry object
var odometry = new Odometry(client);

// retrieve battery percentage
exports.batteryPercentage = () => {
  client.on('navdata.demo', (data)=> {
    return data.batteryPercentage
});
}

exports.takeoff = () => { //do this for all methods
  client.takeoff();
}


exports.land = () => {
  client.land();
}

// altitude in meters
exports.change_height = (altitude) => {
  client.up(parseFloat(altitude));
}

exports.up = (speed) => {
  client.up(parseFloat(speed));
}

exports.down = (speed) => {
  client.down(parseFloat(speed));
}

exports.clockwise = (degree) => {
  ctrl.cw(parseFloat(degree));
}

exports.counterclockwise = (degree) => {
  ctrl.ccw(parseFloat(degree));
}

exports.front = (speed) =>  {
  client.front(parseFloat(speed));
}

exports.back = (speed) => {
  client.back(parseFloat(speed));
}

exports.left = (speed) => {
  client.left(parseFloat(speed));
}

exports.right = (speed) => {
  client.right(parseFloat(speed));
}

exports.stop = (speed) =>   {
  client.stop();
}

exports.disableEmergency = () =>   {
  client.disableEmergency();
}

exports.animate = (animation, duration) => {
  var duration = parseInt(duration, 10);
  client.animate(animation, duration);
}


// Stop motion after traveling certain distance

exports.stopAfter = (distance_mm) => {
  odometry.start();
  setNavDataHook(function(navData) {
    var distance = odometry.distance();
    console.log('distance: ' + distance);
    if (distance > distance_mm) {
      client.stop();
      setNavDataHook(null);
      odometry.stop();
    }
  });
}

exports.fullRotation = () => {
  setTimeout(function(){}, 15000);
  clockwise(90)
  setTimeout(function(){}, 15000);
  clockwise(90)
  setTimeout(function(){}, 15000);
  clockwise(90)
  setTimeout(function(){}, 15000);
  clockwise(90)
}

