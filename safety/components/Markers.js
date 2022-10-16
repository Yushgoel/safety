import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Marker } from "react-native-maps";

export default function Markers() {

  
  return (
    <View style={styles.container}>
      <Marker coordinate={{latitude: lat, longitude: long}} />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
