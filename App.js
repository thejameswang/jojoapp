import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens

//Home login Screen
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('LoginView')
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to JoJo!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

//Logging in Page
class Login extends React.Component {
  constructor() {
    super()
    this.state ={
      username: null,
      password: null
    }
  }

  login() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        alert('LOGIN SUCCESSFUL')
        this.props.navigation.navigate('screenNameGoesHere')
      } else {
        alert('This is an invalid login\n Try again')
        this.props.navigation.navigate('LoginView');
      }
  /* do something with responseJson and go back to the Login view but
   * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      alert('There was an error ' + err)
      /* do something if there was an error with fetching */
    });
  }


  render() {
    return(
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel} onPress={() => {this.login()}}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

//Register Screen
//Checks for User and Pass with database
class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state ={
      username: null,
      password: null
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  register() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        this.props.navigation.goBack()
      } else {
        alert('This account has already been registered')
        this.props.navigation.navigate('LoginScreen');
      }
  /* do something with responseJson and go back to the Login view but
   * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      alert('There was an error ' + err)
      /* do something if there was an error with fetching */
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel} onPress={() => {this.register()}}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginView: {
    screen: Login,
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: '#444444',
    borderWidth:1,
    margin: 5,
    justifyContent: 'center'
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
