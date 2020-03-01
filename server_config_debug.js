const path						  = require('path');
const { execute_faceRecognition } = require('./video_stream/face_detect');
const { retrieve_distance } 	  = require('./drone_navigation/compute_distance');
const { max_arrayItem } 	      = require('./drone_navigation/compute_distance');
const { stopAfter } 	  		  = require('./drone_navigation/navigation');
const { takeoff } 	  		      = require('./drone_navigation/navigation');
const { fullRotation } 	  		  = require('./drone_navigation/navigation');
const { land } 	  		          = require('./drone_navigation/navigation');
const { change_height } 	  	  = require('./drone_navigation/navigation');
const { up } 	  		          = require('./drone_navigation/navigation');
const { down } 	  		          = require('./drone_navigation/navigation');
const { clockwise } 	  		  = require('./drone_navigation/navigation');
const { counterclockwise } 	      = require('./drone_navigation/navigation');
const { batteryPercentage }       = require('./drone_navigation/navigation');
const { front } 	  		      = require('./drone_navigation/navigation');
const { stop } 	  		          = require('./drone_navigation/navigation');
var restify 					  = require('restify');


// Initialize REST Server
var server = restify.createServer({
  'name': 'ar-drone-server'
});

function start() {
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
  server.use(restify.plugins.queryParser());
}

module.exports = {
  start: start
};

// (xi,yi) --> (xtest1, ytest1) --> (xf, yf) --> turn_degrees --> (xi2, yi2) --> (xtest2, ytest2) --> (xf2, yf2)
// detect_before_after_turn list : (0 --> detection before turn, 1 --> detection after turn), ex: [1,0,1,0]

// server functionality

function move_drone(req, res, next){

	var initial_latitude		 = parseFloat(req.query.initial_latitude)
	var initial_longitude		 = parseFloat(req.query.initial_longitude)
	var turn_latitudes  		 = (req.query.turn_latitudes).map(parseFloat)
	var turn_longitudes 		 = (req.query.turn_longitudes).map(parseFloat)
	var position_scan_latitudes  = (req.query.position_scan_latitudes).map(parseFloat)
	var position_scan_longitudes = (req.query.position_scan_longitudes).map(parseFloat)
	var turns_degrees            = (req.query.turns_degrees).map(parseFloat)
	var initial_altitude		 = (parseInt(req.query.initial_altitude))
	var normal_speed			 = (parseInt(req.query.normal_speed))
	var detect_before_after_turn = (req.query.detect_before_after_turn)
	var number_pairs             = detect_before_after_turn.length
	var current_coordinate		 = 0.0
	var batteryPercentage = 0
	var i
 						

	// Actual Navigation
	//takeoff()
	//execute_faceRecognition()
	//change_height(initial_altitude)
	console.log("Number of pairs : " + number_pairs)
	console.log(turn_latitudes)
	console.log(position_scan_latitudes)
	while(true)
		
	{
		if(batteryPercentage == 1) //batteryPercentage() < 45)

			{
				console.log("Current Coordinate : " + current_coordinate)
				//land() // wireless charging possibilites
				res.send('OK')
				break
			}

		console.log("Battery Percentage : " + batteryPercentage)

		batteryPercentage += 1

		var num_scan_pairs			 = 0
		var num_turn_pairs			 = 0
		console.log(detect_before_after_turn)
		
		for(i = 0; i < (number_pairs-1); i++)
			
		{
			console.log("Num scan pairs: " + num_scan_pairs)
			console.log("Num turn pairs: " + num_turn_pairs)	
			console.log("i : " + i)
			console.log("Detect before turn: " + detect_before_after_turn[i])
			
			if (detect_before_after_turn[i] 		== 0)

			{
				console.log(turn_latitudes.length)
				if (num_turn_pairs >= turn_latitudes.length)

					{

						num_turn_pairs -= 1

					}
				console.log(num_turn_pairs)

				if (i == 0)

				{
					var computed_latitudes  = [initial_latitude, position_scan_latitudes[num_scan_pairs]] 
					var computed_longitudes = [initial_longitude, position_scan_longitudes[num_scan_pairs]] 

				}

				else

				{

				 	var computed_latitudes  = [turn_latitudes[num_turn_pairs], position_scan_latitudes[num_scan_pairs]] 
					var computed_longitudes = [turn_longitudes[num_turn_pairs], position_scan_longitudes[num_scan_pairs]] 

				}

				console.log("Computed latitudes : " + computed_latitudes)
				console.log("Computed longitudes : " + computed_longitudes)
				var distance_limit 	    	= (retrieve_distance(computed_latitudes, computed_longitudes))
				console.log("Distance required : " + distance_limit)
				current_coordinate			= [computed_latitudes[1], computed_longitudes[1]]
				//stopAfter(distance_limit)
				//change_height(0)
				//fullRotation()
				//change_height(initial_altitude)
				//front(normal_speed)
				num_scan_pairs 				+= 1
				
				console.log("Current Coordinate : " + current_coordinate)

			}

			else if(detect_before_after_turn[i] 	== 1)

			{
				if (num_scan_pairs >= position_scan_latitudes.length)

					{

						num_scan_pairs -= 1

					}

				if (i==0)

				{
					var computed_latitudes  = [initial_latitude, turn_latitudes[num_turn_pairs]] 
					var computed_longitudes = [initial_longitude, turn_longitudes[num_turn_pairs]] 

				}

				else

				{
					
					var computed_latitudes  = [position_scan_latitudes[num_scan_pairs], turn_latitudes[num_turn_pairs]] 
					var computed_longitudes = [position_scan_longitudes[num_scan_pairs], turn_longitudes[num_turn_pairs]] 

				}
				console.log("Computed latitudes : " + computed_latitudes)
				console.log("Computed longitudes : " + computed_longitudes)


				var distance_limit 	    	= (retrieve_distance(computed_latitudes, computed_longitudes))

				console.log("Distance required : " + distance_limit)

				//stopAfter(distance_limit)
				//front(normal_speed)
				//clockwise(turns_degrees[num_turn_pairs])
				current_coordinate			= [computed_latitudes[1], computed_longitudes[1]]
				console.log("Current Coordinate : " + current_coordinate)

				num_turn_pairs 				+= 1

			}


		}

	}

}

server.get('/v1/move_drone/', move_drone);

//curl "http://localhost:8080/v1/move_drone/?initial_latitude=40.662622&initial_longitude=-74.554678&position_scan_latitudes=40.662635&position_scan_longitudes=-74.554509&turn_latitudes=40.662653&turn_longitudes=-74.554382&position_scan_latitudes=40.662742&position_scan_longitudes=-74.554406&turn_latitudes=40.662761&turn_longitudes=-74.554415&initial_altitude=1&normal_speed=0.1&detect_before_after_turn=0&detect_before_after_turn=1&detect_before_after_turn=0&detect_before_after_turn=1&turns_degrees=90&turns_degrees=90&turns_degrees=90"








