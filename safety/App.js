import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import { Marker, Polyline } from "react-native-maps";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import crimeLocs from './assets/crimeLocs.json';
import {decode} from "@mapbox/polyline"; //please install this package before running!
// const {width, height} = Dimensions.get("window");
import MapViewDirections from 'react-native-maps-directions';
// const ASPECT_RATIO = width / height;


// You can import from local files
import AssetExample from './components/AssetExample';
const GOOGLE_MAPS_APIKEY = '';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function App() {
  
  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.0075,
    longitudeDelta: 0.0055,
  };

  const berkeleyRegion = {
    latitude: 37.8715,
    longitude: -122.2730,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const satherGate = {
    latitude: 37.8703,
    longitude: -122.2595,
    latitudeDelta: 0.02,
    longitudeDelta: 0.03,
  }

  const barkerHall = {
    latitude: 37.8743427,
    longitude: -122.2681808
  }

  const foothill = {
    latitude: 37.8755939,
    longitude: -122.2609752
  }


  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [coords1, setCoords1] = useState([]);
  const [coords2, setCoords2] = useState([]);
  const [coords3, setCoords3] = useState([]);

  const [topRightLat, setTopRightLat] = useState(0); // has to be max
  const [topRightLong, setTopRightLong] = useState(-190); // has to be max

  const [bottomLeftLat, setBottomLeftLat] = useState(190); // has to be min
  const [bottomLeftLong, setBottomLeftLong] = useState(0) // has to be min
  const [hideOrNot, setHideOrNot] = useState(false) // has to be min

  // const [crimeLocs, setCrimeLocs] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  let lat = 0;
  let long = 0;

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    lat = location.coords.latitude;
    long = location.coords.longitude;
  }
  

  
  const getDirections = async (startLoc, destinationLoc, idx) => {
  try {
    const KEY = ""; //put your API key here.
    //otherwise, you'll have an 'unauthorized' error.
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&alternatives=true&key=${KEY}`
    );
    let respJson = await resp.json();

    let northEastLat = respJson.routes[idx].bounds.northeast.lat;
    let northEastLong = respJson.routes[idx].bounds.northeast.lng;
    let southWestLat = respJson.routes[idx].bounds.southwest.lat;
    let southWestLong = respJson.routes[idx].bounds.southwest.lng;
    // console.log(northEastLat);
    if (northEastLat > topRightLat){
      setTopRightLat(northEastLat);
    }
    if (northEastLong > topRightLong){
      setTopRightLong(northEastLong);
    }
    if (southWestLat < bottomLeftLat){
      setBottomLeftLat(southWestLat);
    }
    if (southWestLong < bottomLeftLong){
      setBottomLeftLong(southWestLong);
    }


    let points = decode(respJson.routes[idx].overview_polyline.points);
    // console.log(points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1]
      };
    });
    return coords;
  } catch (error) {
    return error;
    }
  };

  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    getDirections(barkerHall.latitude.toString() + "," + barkerHall.longitude.toString(), foothill.latitude.toString() + "," + foothill.longitude.toString(), 0)
      .then(coords => setCoords1(coords))
      .catch(err => console.log("Something went wrong"));

    getDirections(barkerHall.latitude.toString() + "," + barkerHall.longitude.toString(), foothill.latitude.toString() + "," + foothill.longitude.toString(), 2)
      .then(coords => setCoords3(coords))
      .catch(err => console.log("Something went wrong"));

    getDirections(barkerHall.latitude.toString() + "," + barkerHall.longitude.toString(), foothill.latitude.toString() + "," + foothill.longitude.toString(), 1)
      .then(coords => setCoords2(coords))
      .catch(err => console.log("Something went wrong"));
  }, []);
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={satherGate}>

        {hideOrNot && coords1.length > 0 && <Polyline coordinates={coords1} strokeWidth={5} strokeColor="blue" />}
        {hideOrNot && coords2.length > 0 && <Polyline coordinates={coords2} strokeWidth={5} strokeColor="red" />}
        {hideOrNot && coords3.length > 0 && <Polyline coordinates={coords3} strokeWidth={5} strokeColor="green" />}
        
        {hideOrNot && <Marker coordinate={{latitude: 37.874155, longitude:-122.266298}}>
          <View style={styles.marker}>
            <Text>Most People</Text>
          </View>
        </Marker>}

        {hideOrNot && <Marker coordinate={{latitude: 37.878792, longitude:-122.265282}}>
          <View style={styles.marker}>
            <Text>Least People</Text>
          </View>
        </Marker>}

        <Marker coordinate={{latitude: lat, longitude: long}} pinColor="blue" />
        <Marker coordinate={{latitude: barkerHall.latitude, longitude: barkerHall.longitude}} pinColor="blue" />
        {hideOrNot && <Marker coordinate={{latitude: foothill.latitude, longitude: foothill.longitude}} pinColor="black" />}
        {hideOrNot && crimeLocs.map((data, idx) => {
          if (data.lat < topRightLat && data.lat > bottomLeftLat && data.long < topRightLong && data.long > bottomLeftLong){
          return (
          <Marker coordinate={{latitude: data.lat, longitude: data.long}} />
          );}
        })}
        <GooglePlacesAutocomplete
        placeholder='Where to?'
        onPress={(data, details = null) => {setTimeout(() => {
          setHideOrNot(true);
          console.log(data, details);
        }, 2500);}}
        query={{
          key: '',
          language: 'en',
        }}
        styles={{container: {paddingTop: 15}}}
      />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderColor: "#eee",
    borderRadius: 5,
    elevation: 10,
    // height: "5%",
    // width: "10%"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 40,
    borderRadius: 8,

  },
  input: {
    borderColor: "#888",
    borderWidth: 1,

  },
});
