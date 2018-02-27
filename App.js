import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  RefreshControl,
  AsyncStorage
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

  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super()
    this.userInputValue = ''
    this.passwordInputValue = ''
    this.state ={
      username: null,
      password: null
    }
  }

  componentDidMount() {
    AsyncStorage.multiGet(['username','password'])
  		.then((result) => {
        let savedUser = (JSON.parse(result[0][1]))
        let savedPass = (JSON.parse(result[1][1]))
        if(savedUser && savedPass) {
          this.setState({
            username: savedUser,
            password: savedPass,
        })
        this.login()
      }
  	});
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
        this.props.navigation.navigate('Users')
      } else {
        alert('This is an invalid login\n Try again')
        this.props.navigation.goBack();
      }
  /* do something with responseJson and go back to the Login view but
   * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      alert('There was an error ' + err)
      /* do something if there was an error with fetching */
    });
  }
  loginflow() {
    AsyncStorage.multiSet([['username', JSON.stringify(this.userInputValue)],['password', JSON.stringify(this.passwordInputValue)]])
    .then(() => {
      this.setState({
        username:this.userInputValue,
        password:this.passwordInputValue})
    })
    .then(() => this.login())
  }

  render() {
    return(
      <View style={styles.container}>
        <TextInput id='username' style={styles.input} placeholder="Enter your username"
          onChangeText={(text) => {
            this.userInputValue = text;
          }}/>
        <TextInput id='password' style={styles.input} placeholder="Enter your password" secureTextEntry={true}
          onChangeText={(text) => {
            this.passwordInputValue = text;
          }
        }/>
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => {this.loginflow()}}>
          <Text style={styles.buttonLabel}>Login</Text>
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
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}/>
        <TextInput  style={styles.input} placeholder="Enter your password" secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => {this.register()}}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


//-----------------------LOGGED IN SCREEN ---------------------------------

class UsersScreen extends React.Component {
  //creates title
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={() =>(props.navigation.navigate('Messages'))}>
      <Text>Messages</Text>
    </TouchableOpacity>
  })
  //constuctor
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state ={
      dataSource: ds,
      refreshing: false,
    }
  }

  //Creates refreshing

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => {return response.json()})
    .then((responsetext) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responsetext.users),
        refreshing: false
      })
    })
    .catch((err) => {
      alert('There was an error loading users ' + err)
    })
  }

  //fetches users to be displayed
  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => {return response.json()})
    .then((responsetext) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responsetext.users)
      })
    })
    .catch((err) => {
      alert('There was an error loading users ' + err)
    })
  }

  message() {
    this.props.navigation.navigate('Messages')
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson)
      if(responseJson.success) {
        Alert.alert(
          'Sucess',
          'Your JoJo has been sent to ' + user.username,
          [{text: 'Ok'}] // Button
        )
      }
    })
    .catch((err) => {
      alert('There was an error sending your yo ' + err)
    })
  }

  render() {
    return (
      <ListView
        refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <TouchableOpacity style={styles.lowerBorder} onPress={this.touchUser.bind(this, rowData)}>
          <Text style={[styles.textMedium]}>{rowData.username}</Text>
        </TouchableOpacity>}/>
    );
  }
}

class MessageScreen extends React.Component {
  //creates title
  static navigationOptions = {
    title: 'Messages',
  }
  //constuctor
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state ={
      dataSource: ds,
      refreshing: false
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => {return response.json()})
    .then((responsetext) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responsetext.messages),
        refreshing: false,
      })
    })
    .catch((err) => {
      alert('There was an error loading users ' + err)
    })
  }
  //fetches users to be displayed
  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => {return response.json()})
    .then((responsetext) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responsetext.messages)
      })
    })
    .catch((err) => {
      alert('There was an error loading users ' + err)
    })
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <View style={styles.lowerBorder}>
          <Text style={[styles.textSmall]}>From: {rowData.from.username}</Text>
          <Text style={[styles.textSmall]}>To: {rowData.to.username}</Text>
          <Text style={[styles.textSmall]}>Message: {rowData.body}</Text>
          <Text style={[styles.textSmall]}>When: {rowData.timestamp}</Text>
        </View>}/>
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
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessageScreen,
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
  },
  textMedium: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  lowerBorder: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    marginBottom: 3,
    marginTop: 3,
  },
  textSmall: {
    fontSize: 12,
    margin: 2,
  },
});
