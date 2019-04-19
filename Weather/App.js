import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Picker,
  TextInput,
  AppRegistry,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LoginButton, AccessToken} from 'react-native-fbsdk';


const TOKENAPI = '&appid=f8d83b0dd5a5841e67bb25d2ce7c7716';
const ENDPOINTAPI = 'http://api.openweathermap.org/data/2.5/weather?id=';

class Header extends Component {
  render() {
    return (
    <View>
      <View style={styles.containerHeader}>
          <Text style={styles.contentHeader}> Weather App </Text>
      </View>
      <View style={styles.containerName}>
        <Text style={styles.contentName}> Weather Statistics </Text>
      </View>
    </View>
    );
  }
}


class Facebook extends Component {
  render() {
    return (
      <View style={styles.containerFB}>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
      </View>
    );
  }
}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cities: require('./listofcities.json'),
      weather: null,
    };
  }

  handleUser = props => {
    var result = this.state.cities.filter(ct =>
      ct.name.toLowerCase().match(props.toLowerCase())
    );
    if (result.length > 0 && this.state.city !== result[0].name) {
      this.setState({ city: result[0].name});
      this.getWeatherAPI(result[0].id + '');
    }
  };

  getWeatherAPI(cityID) {
    console.log(cityID)
    return fetch(ENDPOINTAPI + cityID + TOKENAPI)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.cod !== "400"){
          this.setState({
            weather: responseJson.main,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Header />
        <Facebook/>
        <View style={styles.containerBody}>
          <TextInput
            label="City"
            mode="outlined"
            onChangeText={text => this.handleUser(text)}
            placeholder="Choose a city"
            style={styles.textInput}
          />
          <Picker
            selectedValue={this.state.city}
            onValueChange={(v, i) => this.handleUser(v)}
            style={styles.contentPickCity}>
            {this.state.cities.map(ct => (
              <Picker.Item label={ct.name} value={ct.name} />
            ))}
          </Picker>
          { this.state.weather !== null &&
            <ImageBackground source={require('./img/background.png')}  style={styles.containerWeather}>
              <View style={styles.contentTop}>
                <Text style={styles.contentWeatherText}>City: {this.state.city}</Text>
              </View>
              <View style={styles.contentBottom}>
                <Text style={styles.contentWeatherText}>Temperature: {Math.round(this.state.weather.temp - 273.15)} C</Text>
                <Text style={styles.contentWeatherText}>Pressure: {Math.round(this.state.weather.pressure)} P</Text>
                <Text style={styles.contentWeatherText}>Humidity: {this.state.weather.humidity} %</Text>
              </View>
            </ImageBackground>
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    color: '#ecf0f1',
    padding: 8,
  },
  
  containerHeader: {
    backgroundColor: '#18dcff',
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#f6f6f6',
    textAlign: 'center',
  },
  containerName: {
    padding: 20,
  },
  contentName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  containerFB: {
    padding: 5,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  containerBody: {
    margin: 15,
  },
  textInput: {
    borderBottomWidth: 2,
    borderColor: '#18dcff',
    textAlign: 'center',
    padding: 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 18,
    width: '80%',
  },
  contentPickCity: {
    height: 100,
    width: '87%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  containerWeather: {
    marginTop: 120,
    width: '100%',
    height: 420,
    color: "#ffffff",
    marginBottom: 20
  },
  contentTop: {
    marginTop: 20,
  },
  contentBottom: {
    marginTop: 280,
  },
  contentWeatherText: {
    paddingLeft: 5,
    color: "#dfe4ea",
    fontSize: 20
  }
});

AppRegistry.registerComponent('Weather', () => App);
