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
import Slider from './app/slider';

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
      selectedTap: 'video',
      logined: false,
      booted:false,
      entered:false,
    }
  }
  componentDidMount() {
    const nowTime = Date.now();
    AsyncStorage
      .multiGet(['userData','entered'])
      .then(data => {
        let newState = {
          booted:true,
        };
        let userData = data[0][1];
        let entered = data[1][1];
        let enterData;
        // let enterData = JSON.parse(entered);
        let user;
        if (userData) {
          user = JSON.parse(userData);
        }
        if (user && user.accessToken) {
          newState.userData = user;
          newState.logined = true;
        } else {
          newState.logined = false;
        }
        if(entered){
          enterData = JSON.parse(entered);
          let boo = nowTime - enterData.time;
          console.log('差值：',boo);
          //当登录时间超过3天，就显示引导页面
          if(enterData.enter === 'yes' && (nowTime - 1000 * 60 *60 * 24 * 3) < enterData.time){
            newState.entered = true;
            // console.log('chaog')
          }
          console.log(enterData.time)
        }
        // setTimeout(() => {
          this.setState(newState);
        // }, 2000)
      })
      .catch(err => {
        console.log(err);
      });

    // AsyncStorage.multiRemove(['userData','entered'])
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

  _enter(){ 
    this.setState({
      entered:true,
    },() => {
      const time = Date.now();
      let enterValue = {
        enter:'yes',
        time:time,
      }
      let enterData = JSON.stringify(enterValue);
      AsyncStorage.setItem('entered',enterData)
        .then( () => {
          console.log('登录了');
        })
        .catch( err => {
          console.log(err);
        });
    })
  }

  render() {
    if (!this.state.booted) {
      return (
        <View style={styles.splash}>
          <ActivityIndicator color="red" />
        </View>
      );
    }

    if(!this.state.entered){
      return <Slider enter={this._enter.bind(this)}/>
    }

    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin.bind(this)} />
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
