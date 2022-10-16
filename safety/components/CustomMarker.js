import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';

//create our custom marker component.
export default function CustomMarker() {
  return (
    <View style={styles.marker}>
      <Text style={styles.color}>Most People</Text>
    </View>
  );
}
//styles for our custom marker.
const styles = StyleSheet.create({
  marker: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#007bff",
    borderColor: "#eee",
    borderRadius: 5,
    elevation: 10,
  },
  text: {
  color: "#fff",   
  },
});