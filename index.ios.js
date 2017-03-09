/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  StatusBar,
  View,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Home from './app/home/index';
import Creation from './app/creation/index';
import Me from './app/me/index';
import Login from './app/login';

class RN1 extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'root',
          component: Root,
        }}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={(route, navigator) => {
          const Component = route.component;
          return (
            <View style={styles.container}>
              <StatusBar barStyle='light-content' />
              <Component {...route.params} navigator={navigator} />
            </View>
          )
        }}
      />
    );
  }
}
class Root extends Component {
  constructor(props) {
    super(props);
    this._afterLogin = this._afterLogin.bind(this);
    this.state = {
      selectedTap: 'creation',
      logined: false,
      booted:false,
    }
  }
  componentWillMount() {
    AsyncStorage
      .getItem('userData')
      .then(data => {
        let newState = {
          booted:true,
        };
        let userData;
        if (data) {
          userData = JSON.parse(data);
        }
        if (userData && userData.accessToken) {
          newState.userData = userData;
          newState.logined = true;
        } else {
          newState.logined = false;
        }
        // setTimeout(() => {
          this.setState(newState);
        // }, 2000)
      })
      .catch(err => {
        console.log(err);
      });
    // AsyncStorage.removeItem('userData').then(() => console.log('remove ok'))
  }

  _afterLogin(data) {
    data = JSON.stringify(data.data);
    AsyncStorage
      .setItem('userData', data)
      .then(() => {
        this.setState({
          logined: true,
        })
        console.log('save ok');
      })
      .catch(err => {
        console.log(err);
      });
  }

  _logout() {
    const that = this;
    AsyncStorage
      .removeItem('userData')
      .then(() => {
        console.log('退出成功');
        that.setState({
          logined: false,
          user: null,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    if (!this.state.booted) {
      return (
        <View style={styles.splash}>
          <ActivityIndicator color="red" />
        </View>
      );
    }
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin} />
    }
    return (
      <TabBarIOS tintColor="#ed7b66">
        <Icon.TabBarItemIOS
          title="视频"
          iconName="ios-film-outline"
          selectedIconName="ios-film"

          selected={this.state.selectedTap == 'video'}
          onPress={() => {
            this.setState({
              selectedTap: 'video'
            })
          }}
        >
          <Home navigator={this.props.navigator} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="发布"
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"

          selected={this.state.selectedTap == 'creation'}
          onPress={() => {
            this.setState({
              selectedTap: 'creation'
            })
          }}
        >
          <Creation navigator={this.props.navigator} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="我的"
          iconName="ios-person-outline"
          selectedIconName="ios-person"

          selected={this.state.selectedTap == 'me'}
          onPress={() => {
            this.setState({
              selectedTap: 'me'
            })
          }}
        >
          <Me user={this.state.user} logout={this._logout.bind(this)} navigator={this.props.navigator} />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

AppRegistry.registerComponent('RN1', () => RN1);
