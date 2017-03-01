import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

import Back from '../../common/back';

const { width, height } = Dimensions.get('window');
export default class Detail extends Component {
  constructor(props) {
    super(props);
    const navigator = this.props.navigator;
    this.state = {
      navigator: navigator,

      //video loads
      videoReady: false,
      videoLoaded: false,
      playing:false,

      videoProgress: 0,
      videoTotal: 0,
      currentTime: 0,

      rate: 1,
      muted: false,

      resizeMode: 'contain',
      repeat: false,
      paused: false

    }
  }

  _onLoadStart() {
    console.log('onLoadStart');
  }
  _onLoad() {
    console.log('onLoad');
  }
  _onProgress(data) {
    if (!this.state.videoReady) {
      this.setState({
        videoReady: true,
      })
    }
    const duration = data.seekableDuration;
    const currentTime = data.currentTime;
    const percent = Number((currentTime / duration).toFixed(4));
    var newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(4)),
      videoProgress: percent,
    }
    if(!this.state.videoLoaded){
      this.setState({
        videoLoaded:true,
      })
    }
    if(!this.state.playing){
      this.setState({
        playing:true,
      })
    }
    this.setState(newState);
    console.log(data);

  }
  _onEnd() {
    // alert('1')
    this.setState({
      playing:false,
      videoProgress: 1
    });
    alert('1')
    console.log('onend');
  }
  _onError(e) {
    console.log(e)
    console.log('onerr');
  }

  _replay(){
    this.refs.videoPlayer.seek(0);
  }

  componentDidMount() {
    console.log(this.props.data);
  }

  render() {
    const data = this.props.data;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={styles.head}>
          <TouchableOpacity onPress={() => Back(this.state.navigator)}>
            <View style={styles.backBtn}>
              <Icon name="ios-arrow-back" style={styles.backIcon} />
              <Text style={styles.backText}>返回</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headTitle}>
            <Text style={styles.headText} numberOfLines={1}>视频详情页</Text>
          </View>
        </View>
        <View style={styles.videoHead}>
          <Text style={styles.videoTitle}>{data.title}</Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            source={{ uri: data.video }}
            style={styles.video}
            volume={2}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />
          {
            !this.state.videoReady && <ActivityIndicator color="#ee735c" style={styles.loading} />
          }
          {
            this.state.videoLoaded && !this.state.playing
              ? <Icon
                name="ios-play"
                onPress={this._replay.bind(this)}
                style={styles.playIcon} />
              : null
          }
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, { width: width * this.state.videoProgress }]}></View>
          </View>
          <Button title="暂停/播放" color="red" onPress={()=>this.setState({
            paused:!this.state.paused
          })}/>
           <Button title="全屏播放" color="red" onPress={()=>this.refs.videoPlayer.presentFullscreenPlayer()}/>
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  head: {
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  backBtn: {
    width: 50,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  backIcon: {
    fontSize: 22,
    color: '#ed7b66'
  },
  backText: {
    color: '#333',
  },
  headTitle: {
    width: width - 120,
    alignSelf: 'center'
  },
  headText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  videoBox: {
    width,
    height: 350,
    marginTop: 5,
  },

  video: {
    width,
    height: 300,
    backgroundColor: '#000',
  },
  videoHead: {
    padding: 10,
    backgroundColor: '#fff'
  },

  videoTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center'
  },

  loading: {
    position: 'absolute',
    width,
    height: 300,
  },

  progressBox: {
    width,
    height: 3,
    backgroundColor: '#ccc',
  },

  progressBar: {
    width: 0,
    height: 3,
    backgroundColor: 'red'
  },
  playIcon: {
    position: 'absolute',
    left:width / 2 - 23,
    top:300 / 2 -23,
    paddingLeft: 17,
    paddingTop: 5,
    width: 46,
    height: 46,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    backgroundColor: 'transparent',
    fontSize: 35,
    color: '#ed7b66',
  },
})