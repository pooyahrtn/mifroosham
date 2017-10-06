import {PermissionsAndroid} from 'react-native';

export function requestLocation(navigator, onSuccess, onFailed){
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((res) => {
    if (!res) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'اجازه دستیابی به موقعیت مکانی',
          'message': 'برای نشان دادن فاصله ی پست ها از شما این دسترسی لازم است.'
        }
      ).then(
        (granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          }else {
            //TODO: show why we need location Permission
          }
        }
      )
    }else {
      navigator.geolocation.getCurrentPosition(
       (position) => {
        let latitude = Math.round(position.coords.latitude * 100) / 100
        let longitude = Math.round(position.coords.longitude * 100) / 100
        onSuccess({latitude, longitude})
       },
       onFailed,
       { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
    }
  })
}
