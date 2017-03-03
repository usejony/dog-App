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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Home from './app/home/index';
import Creation from './app/creation/index';
import Me from './app/me/index';

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
    this.state = {
      selectedTap: 'me'
    }
  }
  render() {
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
          <Me navigator={this.props.navigator} />
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
});

AppRegistry.registerComponent('RN1', () => RN1);
