import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Button,
  ListView,
  PixelRatio,
  Modal,
  ScrollView,
  Alert,
  ProgressViewIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

import Back from '../../common/back';
import config from '../../common/config';
import { GET, POST } from '../../common/request';

const { width, height } = Dimensions.get('window');
const cacheResult = {
  nextPage: 0,
  items: [],
  total: 0
}
export default class Detail extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      dataSource: ds.cloneWithRows([]),
      //video loads
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

      isVisible: false,
      replyContent: '',

      isSending: false,

    }
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

  _renderHeader() {
    const data = this.props.data;
    return (
      <View>
        <View style={styles.videoDesc}>
          <Text style={styles.desc}>{data.description}</Text>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    );
  }

  _renderRow(row) {
    return (
      <View style={styles.replyBox}>
        <Image source={{ uri: row.replyAvatar }} style={styles.replyAvatar} />
        <View style={styles.replyInfo}>
          <View style={styles.replyHead}>
            <Text style={styles.replyNickname}>{row.replyNickname}</Text>
            <Text style={styles.replyDate}>{row.replyDate}</Text>
          </View>
          <Text style={styles.replyContent}>{row.replyContent}</Text>
        </View>
      </View>
    );
  }

  _separator(row, sectionId) {
    return (
      <View key={sectionId} style={styles.separator} />
    );
  }

  _renderFooter() {
    if (!this._hasMore() && cacheResult.total !== 0) {
      return (
        <View style={styles.loadMore}>
          <Text style={styles.loadMoreText}>没有更多了</Text>
        </View>
      );
    }
    return (
      <View style={styles.loadMore}>
        <ActivityIndicator style={styles.loadMoreIcon} />
        <Text style={styles.loadMoreText}>努力加载中...</Text>
      </View>
    );
  }

  _loadMore() {
    if (!this._hasMore() || this.state.isLoading) {
      return
    }
    const page = cacheResult.nextPage;
    this._fetchData(page);
  }

  _hasMore() {
    return cacheResult.items.length !== cacheResult.total;
  }

  _onModalClose() {
    this.setState({
      isVisible: false,
      paused: false,
      replyContent: ''
    });
  }

  _onModalShow() {
    this.setState({
      isVisible: true,
      paused: true,
    })
  }

  _onSubmit() {
    if (!this.state.replyContent) {
      return Alert.alert('留言不能为空');
    }
    if (this.state.isSending) {
      return Alert.alert('正在评论中');
    }
    this.setState({
      isSending: true
    }, () => {
      const body = {
        accessToken: 'duchao',
        creation: this.props.data._id,
        replyContent: this.state.replyContentk
      }
      const url = config.api.base + config.api.comment;
      const date = new Date();
      const dateNow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      POST(url, body)
        .then(data => {
          if (data && data.success) {
            let items = cacheResult.items.slice();
            items = [{
              replyAvatar: 'http://img4.imgtn.bdimg.com/it/u=1657348769,2550546710&fm=214&gp=0.jpg',
              replyNickname: '都超',
              replyDate: dateNow,
              replyContent: this.state.replyContent
            }].concat(items);
            cacheResult.items = items;
            cacheResult.total = cacheResult.total + 1;
            this.setState({
              isSending: false,
              dataSource: this.state.dataSource.cloneWithRows(cacheResult.items),
            });
            this._onModalClose();
          }
        })
        .catch((err) => {
          this.setState({
            isSending: false,
          });
          console.log(err);
          Alert.alert("留言失败，稍后重试！");
        });
    });
  }

  componentDidMount() {
    this._fetchData(1);
  }

  _fetchData(page) {
    const url = config.api.base + config.api.comment;
    const params = {
      accussToken: 'duchao',
      creation: this.props.data._id,
      page: page
    }
    this.setState({
      isLoading: true,
    })
    GET(url, params)
      .then(data => {
        if (data && data.success) {
          let items = cacheResult.items.slice();
          items = items.concat(data.data);
          cacheResult.items = items;
          cacheResult.total = data.total;
          cacheResult.nextPage += 1;
          this.setState({
            isLoading: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResult.items),
          })
        }
      })
      .catch(e => {
        this.setState({
          isLoading: false,
        })
        console.log(e);
      })
  }

  render() {
    const data = this.props.data;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={styles.head}>
          <TouchableOpacity onPress={() => Back(this.props.navigator)}>
            <View style={styles.backBtn}>
              <Icon name="ios-arrow-back" style={styles.backIcon} />
              <Text style={styles.backText}>返回</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headTitle}>
            <Text style={styles.headText} numberOfLines={1}>视频详情</Text>
          </View>
        </View>
        <View style={styles.authorBox}>
          <Image source={{ uri: data.author.avatar }} style={styles.authorAvatar} />
          <View style={styles.authorContent}>
            <Text style={styles.authorNickname}>{data.author.nickName}</Text>
            <Text style={styles.videoDate}>{data.date}</Text>
          </View>
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

        <ListView
          contentContainerStyle={styles.listviewBox}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}

          onEndReached={this._loadMore.bind(this)}
          onEndReachedThreshold={50}
          renderFooter={this._renderFooter.bind(this)}
          renderSeparator={this._separator.bind(this)} />
        <TouchableOpacity style={styles.writeBox} onPress={this._onModalShow.bind(this)}>
          <Font name="pencil-square-o" style={styles.writeIcon} />
          <View style={styles.writeInput}>
            <Text style={styles.writePlace}>写点儿评论吧！</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.isVisible}
          animationType="slide"
          onRequestClose={this._onModalClose.bind(this)}>
          <View style={styles.modalBox}>
            <View style={styles.head}>
              <TouchableOpacity onPress={this._onModalClose.bind(this)} style={styles.closeBtn}>
                <Icon name="ios-close-outline" style={styles.closeIcon} />
                <Text style={styles.closeText}>关闭</Text>
              </TouchableOpacity>
            </View>
            <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
              <TextInput
                multiline={true}
                autoFocus={true}
                placeholder="在这里输入你想说的话..."
                style={styles.commentInp}
                onChangeText={(text) => {
                  this.setState({
                    replyContent: text,
                  })
                }}
              />
              <TouchableHighlight underlayColor="#40af40" style={styles.submitComment} onPress={this._onSubmit.bind(this)}>
                <Text style={styles.submitText}>提交</Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 45
  },
  head: {
    height: 55,
    paddingTop: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,.1)',
    borderBottomWidth: 1
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
    justifyContent: 'center',
  },

  video: {
    width,
    height: width * 0.56,
    backgroundColor: '#000',
  },
  authorBox: {
    paddingVertical: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  authorContent: {
    flex: 1,
  },
  authorNickname: {
    color: '#333',
    fontSize: 11,
  },
  videoDate: {
    color: '#777',
    marginTop: 2,
    fontSize: 11,
  },

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
  videoDesc: {
    padding: 10,
    backgroundColor: '#fff',
  },
  desc: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  commentsBox: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  commentArea: {
    paddingVertical: 7,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  commentTitle: {
    fontSize: 13,
    color: "#333"
  },
  replyBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  replyInfo: {
    flex: 1,
  },
  replyHead: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  replyNickname: {
    fontSize: 12,
    color: '#333',
  },
  replyDate: {
    fontSize: 10,
    color: '#888',
    marginLeft: 15,
  },
  replyContent: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    color: '#777',
  },
  listviewBox: {
    backgroundColor: '#fff',
  },
  separator: {
    width,
    height: 1 / PixelRatio.get(),
    marginLeft: 20,
    backgroundColor: "#c7c7c7",
  },
  loadMore: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreIcon: {
    marginRight: 10,
  },
  loadMoreText: {
    fontSize: 12,
    color: '#777',
  },
  writeBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    height: 45,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  writeIcon: {
    fontSize: 28,
    color: '#777',
    marginRight: 10,
  },
  writeInput: {
    flex: 1,
    height: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  writePlace: {
    fontSize: 12,
    color: '#888'
  },
  closeBtn: {
    width: 50,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  closeText: {
    fontSize: 14,
    color: '#333',
  },
  closeIcon: {
    fontSize: 30,
    color: '#333',
    marginTop: 3
  },
  modalBox: {
    flex: 1,
  },
  commentInp: {
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 2 / PixelRatio.get(),
    borderRadius: 5,
    height: 120,
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: '#666',
    lineHeight: 14,
    fontSize: 12,
    shadowColor: 'rgba(0,0,0,.2)',
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 10,
    shadowOpacity: 5
  },
  submitComment: {
    width: width - 100,
    marginTop: 20,
    height: 35,
    alignSelf: 'center',
    backgroundColor: '#52df52',
    borderRadius: 8,
    justifyContent: "center",
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    color: '#fff'
  }
})