import {EnglighNumberToPersian} from './NumberUtils.js'

function getLocationFromString(text){
  return text.split(',')
}

export function getDistanceInPersian(current_location, pointlocation){
  if(pointlocation === 'undefined' || pointlocation === 'null'){
    return
  }
  second_location = getLocationFromString(pointlocation);
  distance = Math.round(getDistanceFromLatLonInKm(current_location.latitude, current_location.longitude,
    second_location[0], second_location[1]));
  if(distance <= 1){
    return 'نزدیک'
  }else{
    return EnglighNumberToPersian(distance) +  'km'
  }
}
export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
