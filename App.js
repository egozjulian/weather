import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    (async() => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        setErrorMsg('Permission denied');
        return
      }

      let loc = await Location.getCurrentPositionAsync({});

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid={c56d093bef0d58d4b98a58fceb2c8504}`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setLocation(json)
      })
      .catch((error) => {
        console.log(error);
      })

      setLocation(loc);
    })();
  }, [])

  if (errorMsg !== null) {
    //there is an error
    return (
      <View style={styles.container}>
        <Text>There has been an error: ${errorMsg} </Text>
        
        <StatusBar style="auto" />
      </View>
    );
  } else if (location !== null) {
    //success
    return (
      <View style={styles.container}>
        <Text>{location.name}</Text>
        <Image
          source = {{
            uri:`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`
          }}
          style={{width:100, height:100}}
        />
        <StatusBar style="auto" />
      </View>
    );

  } else {
    //waiting
    return (
      <View style={styles.container}>
        <Text>waiting...</Text>
        <StatusBar style="auto" />
      </View>
    );

  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
