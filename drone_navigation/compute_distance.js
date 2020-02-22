const haversine = require('haversine')

function max_arrayItem(array){
	return Math.min.apply(null, array);
}

exports.retrieve_distance = (latitudes_list, longitudes_list) => {
	
	const start = {
		latitude: latitudes_list[0],
		longitude: longitudes_list[0]
	}	

	const end = {
		latitude: latitudes_list[1],
		longitude: longitudes_list[1]
	}

	return haversine(start, end, {unit: 'meter'})

}

