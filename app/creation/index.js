import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Progress
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const options = {
  title: '选择视频',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '录制视频',
  chooseFromLibraryButtonTitle: '选择已有视频',
  mediaType:'video',
  noData: false, 
  videoQuality: 'medium',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
export default class Creation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVideo: null,
      videoReady: false,
      videoLoaded: false,
      playing: false,
      videoOk: true,

      videoProgress: 0,
      videoTotal: 0,
      currentTime: 0,

      rate: 1,
      muted: false,

      resizeMode: 'contain',
      repeat: false,
      paused: false,
      isLoading: false,
    }
  }
  videoPicker() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      }
      let uri = response.uri;
      this.setState({
        previewVideo:uri
      })
      // let user = this.state.user;
      // const avatarData = 'data:image/jpeg;base64,' + response.data;
      // const timestamp = Date.now();
      // const tags = 'app,avatar';
      // const folder = 'avatar';
      // const signatureURL = config.api.base + config.api.signature;
      // const accessToken = user.accessToken;

      // POST(signatureURL, {
      //   accessToken: accessToken,
      //   timestamp: timestamp,
      //   folder: folder,
      //   tags: tags,
      //   type: 'avatar'
      // })
      //   .then(data => {
      //     if (data && data.success) {
      //       // console.log("返回的id:", data)
      //       const signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
      //       signature = sha1(signature);
      //       // console.log('签名：', signature);
      //       let body = new FormData();
      //       body.append('folder', folder);
      //       body.append('timestamp', timestamp);
      //       body.append('signature', signature);
      //       body.append('tags', tags);
      //       body.append('api_key', CLOUDINARY.api_key);
      //       body.append('resource_type', 'image');
      //       body.append('file', avatarData);
      //       this._upload(body);
      //     }
      //   })
      //   .catch(err => {
      //     console.log('从服务器获取签名：', err);
      //   });
    });
  }
   _onLoadStart() {
    console.log('onLoadStart');
  }
  _onLoad() {
    console.log('onLoad');
  }
  /**
   * 
   * @param {Object} 视频播放中的所有数据 
   */
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
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true,
      })
    }
    if (!this.state.playing) {
      this.setState({
        playing: true,
      })
    }
    this.setState(newState);

  }
  _onEnd() {
    // alert('1')
    this.setState({
      playing: false,
      videoLoaded: false,
      videoProgress: 1,
      videoOk: false,
    });
  }
  _onError(e) {
    console.log(e)
    this.setState({
      videoOk: false,
    })
  }

  _replay() {
    this.refs.videoPlayer.seek(0);
  }

  _paused() {
    if (!this.state.paused) {
      this.setState({
        paused: true,
      })
    }
  }

  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false,
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.title}>
            {
              this.state.previewVideo
                ? '点击按钮配音'
                : '理解狗狗从配音开始'
            }
          </Text>
          <Text style={styles.changeVideo}>更换视频</Text>
        </View>
        <View style={styles.page}>
          {
            this.state.previewVideo
              ? <View style={styles.videoContainer}>
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
                    !this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
                  }

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

                  {
                    this.state.videoLoaded && this.state.playing
                      ? <TouchableOpacity onPress={this._paused.bind(this)} style={styles.pausedBtn}>
                        {
                          this.state.paused
                            ? <Icon name="ios-play" style={styles.resumeIcon} onPress={this._resume.bind(this)} />
                            : <Text style={{ backgroundColor: 'transparent' }}></Text>
                        }
                      </TouchableOpacity>
                      : null
                  }
                  <ProgressViewIOS progress={this.state.videoProgress} progressTintColor="red" trackTintColor="rgba(0,0,0,.2)" />
                </View>

              </View>
              : <TouchableOpacity style={styles.uploadContainer} onPress={this.videoPicker.bind(this)}>
                <View style={styles.uploadBox}>
                  <Image source={require('../../imgs/tap.png')} style={styles.uploadIcon} />
                  <Text style={styles.uploadTitle}>点我上传视频</Text>
                  <Text style={styles.uploadDesc}>建议时长不超过20秒</Text>
                </View>
              </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ed7b66'
  },
  title: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  changeVideo: {
    position: 'absolute',
    padding: 5,
    top: 20,
    right: 10,
    color: '#fff',
  },
  page: {
    flex: 1,
    alignSelf: 'center',
  },
  uploadContainer: {
    width: width - 40,
    padding: 20,
    marginTop: width * 0.2,
    // alignSelf:'center',
    borderColor: '#ed7b66',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    width: width - 100,
    height: width - 250,
  },
  uploadTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  uploadDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  videoBox: {
    width,
    justifyContent: 'center',
  },

  video: {
    width,
    height: width * 0.56,
    backgroundColor: '#000',
  },
  // authorBox: {
  //   paddingVertical: 5,
  //   backgroundColor: '#fff',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // authorAvatar: {
  //   width: 30,
  //   height: 30,
  //   borderRadius: 15,
  //   marginLeft: 10,
  //   marginRight: 10,
  // },
  // authorContent: {
  //   flex: 1,
  // },
  // authorNickname: {
  //   color: '#333',
  //   fontSize: 11,
  // },
  // videoDate: {
  //   color: '#777',
  //   marginTop: 2,
  //   fontSize: 11,
  // },

  loading: {
    position: 'absolute',
    width,
    height: width * 0.56,
  },
  playIcon: {
    position: 'absolute',
    left: width / 2 - 23,
    top: width * 0.56 / 2 - 23,
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
  resumeIcon: {
    position: 'absolute',
    left: width / 2 - 23,
    top: width * 0.56 / 2 - 23,
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
    // zIndex:10
  },

  pausedBtn: {
    position: 'absolute',
    width,
    height: width * 0.56,
    left: 0,
    top: 0,
  },

  failText: {
    position: 'absolute',
    top: width * 0.56 / 2 + 25,
    width,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 12
  },
})
