import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  PixelRatio,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  AsyncStorage,
  ListView,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'react-native-blur';
import ImagePicker from 'react-native-image-picker';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button';
import Picker from 'react-native-picker';

import Back from '../../common/back';
import { POST } from '../../common/request';
import config from '../../common/config';

const { width, height } = Dimensions.get('window');
const options = {
  title: '选择照片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '从相册选择',
  noData: false,
  allowsEditing: true,
  quality: 0.75,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const CLOUDINARY = {
  cloud_name: 'rnapp',
  api_key: '777432449111371',
  api_secret: 'hVwKCy7dXHMg7CpU05-weRQILUI',
  base: 'http://res.cloudinary.com/rnapp',
  image: 'https://api.cloudinary.com/v1_1/rnapp/image/upload',
  video: 'https://api.cloudinary.com/v1_1/rnapp/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/rnapp/raw/upload'
}
function avatar(id, type) {
  if (id.indexOf('http') > -1) {
    return id;
  }
  if (id.indexOf('data:image') > -1) {
    return id;
  }
  return CLOUDINARY.base + '/' + type + '/upload/' + id;
}

const ageArr = () => {
  let arr = []
  for (var i = 0; i < 70; i++) {
    arr[i] = i;
  }
  return arr;
}

export default class extends Component {
  constructor(props) {
    super(props);
    const user = this.props.user || {};
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false,
      pickerVisible: false,
      num: "10"
    }
  }
  imagePicker() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      }
      let user = this.state.user;
      const avatarData = 'data:image/jpeg;base64,' + response.data;
      const timestamp = Date.now();
      const tags = 'app,avatar';
      const folder = 'avatar';
      const signatureURL = config.api.base + config.api.signature;
      const accessToken = user.accessToken;

      POST(signatureURL, {
        accessToken: accessToken,
        timestamp: timestamp,
        folder: folder,
        tags: tags,
        type: 'avatar'
      })
        .then(data => {
          if (data && data.success) {
            // console.log("返回的id:", data)
            const signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
            signature = sha1(signature);
            // console.log('签名：', signature);
            let body = new FormData();
            body.append('folder', folder);
            body.append('timestamp', timestamp);
            body.append('signature', signature);
            body.append('tags', tags);
            body.append('api_key', CLOUDINARY.api_key);
            body.append('resource_type', 'image');
            body.append('file', avatarData);
            this._upload(body);
          }
        })
        .catch(err => {
          console.log('从服务器获取签名：', err);
        })
    });
  }
  _upload(body) {
    let that = this;
    this.setState({
      avatarUploading: true,
      avatarProgress: 0,
    });
    // console.log(body);
    let xhr = new XMLHttpRequest();
    let url = CLOUDINARY.image;

    xhr.open('POST', url);
    xhr.onload = () => {
      if (xhr.status !== 200 || !xhr.responseText) {
        Alert.alert('请求失败');
        this.setState({
          avatarProgress: 0,
          avatarUploading: false,
        });
        console.log('responseText:',xhr.responseText);
        return;
      }

      let response;
      try {
        response = JSON.parse(xhr.response);
        console.log(response)
      } catch (e) {
        console.log('carch:',e);
        console.log('parse fails');
      }

      if (response && response.public_id) {
        let user = that.state.user;

        user.avatar = response.public_id
        that.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0,
        });
        this._asyncUser(true);
      }
    }

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(3));
          // console.log(percent);
          that.setState({
            avatarProgress: percent,
          })
        }
      }
    }
    xhr.send(body);
  }

  _asyncUser(isAvatar) {
    const that = this;
    let user = this.state.user;
    // console.log('远程更新：', user);
    if (user && user.accessToken) {
      let url = config.api.base + config.api.update;
      POST(url, user)
        .then(data => {
          if (data && data.success) {
            let user = data.data;
            if (isAvatar) {
              Alert.alert('头像更新成功');
            }
            // console.log('更新返回的新数据：', user);
            that.setState({
              user: user,
            }, () => {
              AsyncStorage.setItem('userData', JSON.stringify(user)).then(() => console.log('save ok'))
              that._closeModal();
            });
          }
        })
        .catch(err => {
          console.log("err：", err);
        });
    }
  }

  _showModal() {
    if (!this.state.modalVisible) {
      this.setState({
        modalVisible: true,
      })
    }
  }
  _closeModal() {
    if (this.state.modalVisible) {
      this.setState({
        modalVisible: false,
      });
      this.getLocalData();
    }
  }

  _updateUser() {
    this._asyncUser();
  }

  changeState(key, value) {
    let user = this.state.user;
    user[key] = value;
    this.setState({
      user: user,
    })
  }
  /**
   * @param {Array} selected 已选项
   * @param {Array} data     待选数据
   */
  changePickerState(key, data, selected) {
    let user = this.state.user;
    this.setState({
      pickerVisible: true
    })
    console.log(data);
    Picker.init({
      pickerData: data,
      selectedValue: selected,
      pickerTitleText: '选择性别',
      pickerConfirmBtnColor: [237, 123, 102, 1],
      pickerCancelBtnColor: [237, 123, 102, 1],
      onPickerConfirm: (d) => {
        let user = this.state.user;
        user[key] = d[0];
        this.setState({
          user: user,
          pickerVisible: false
        });
      },
      onPickerCancel: () => {
        this.setState({
          pickerVisible: false
        });
      },
    });
    Picker.show();
  }

  _closePicker() {
    this.setState({
      pickerVisible: false
    });
    Picker.toggle();
  }

  componentDidMount() {
    this.getLocalData();
  }

  getLocalData() {
    AsyncStorage
      .getItem('userData')
      .then(data => {
        let user;
        if (data) {
          user = JSON.parse(data);
        }
        // console.log('从本地获取到的数据:', user);
        if (user && user.accessToken) {
          this.setState({
            user: user
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    // AsyncStorage.removeItem('imgPath').then(()=>console.log('remove ok'))
  }

  render() {
    const user = this.state.user;

    return (
      <View style={styles.container}>

        <ParallaxScrollView
          backgroundColor="#ed7b66"
          stickyHeaderHeight={55}
          parallaxHeaderHeight={160}
          renderBackground={() => (
            <View style={styles.bg}>
              {
                user.avatar
                  ? <Image source={{ uri: avatar(user.avatar, 'image') }} style={styles.bgImg} blurRadius={8} />
                  : <Image source={require('../../imgs/bg.png')} style={styles.bgImg} blurRadius={0} />
              }
            </View>
          )}
          renderForeground={() => (
            <View style={styles.foreground}>
              <TouchableOpacity onPress={this.imagePicker.bind(this)}>
                {
                  user.avatar
                    ? <View style={styles.uploadBox}>{
                      this.state.avatarUploading
                        ? <Progress.Circle size={70}
                          showsText={true}
                          color="#ee735c"
                          progress={this.state.avatarProgress}
                        />
                        : <Image source={{ uri: avatar(user.avatar, 'image') }} style={styles.foreImg} />
                    }
                    </View>
                    : <View style={styles.uploadBox}>
                      {
                        this.state.avatarUploading
                          ? <Progress.Circle size={70}
                            showText={true}
                            color="#ee735c"
                            size={70}
                            progress={this.state.avatarProgress}
                          />
                          : <Text style={styles.uploadText}>上传头像</Text>
                      }
                    </View>
                }
              </TouchableOpacity>
              <View style={styles.info}>
                <Text style={styles.foreText}>{user.nickname}</Text>
                <Text style={[styles.foreText, { marginTop: 8, color: '#eee' }]}>“这个人很懒，没有留下什么。”</Text>
              </View>
            </View>
          )}
          renderStickyHeader={() => (
            <View style={styles.stickyHead}>
              <Text style={styles.stickyText}>个人中心</Text>
            </View>
          )}
          renderFixedHeader={() => (
            <TouchableOpacity style={styles.gear} onPress={this._showModal.bind(this)}>
              <Text style={styles.edit}>编辑</Text>
            </TouchableOpacity>
          )}
        >
          <Button style={styles.logout} onPress={this.props.logout}>退出登录</Button>
        </ParallaxScrollView>
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.head}>
              <Text style={styles.title}>狗狗信息</Text>
              <TouchableOpacity style={styles.cancelBtn} onPress={this._closeModal.bind(this)}>
                <Text style={styles.titleText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishBtn} onPress={this._updateUser.bind(this)}>
                <Text style={styles.titleText}>完成</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.fieldContainer}
              keyboardDismissMode='on-drag'>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>昵称</Text>
                <TextInput
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.nickname}
                  placeholder='请输入狗狗的昵称'
                  onChangeText={text => {
                    this.changeState('nickname', text);
                  }}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>性别</Text>
                <TextInput
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.gender}
                  placeholder='狗狗的性别'
                  onFocus={this.changePickerState.bind(this, 'gender', ['男', '女'], user.gender ? [user.gender] : ['男'])}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>年龄</Text>
                <TextInput
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  keyboardType="numeric"
                  autoCorrect={false}
                  defaultValue={user.age ? String(user.age) : null}
                  placeholder='请输入狗狗的年龄'
                  onFocus={this.changePickerState.bind(this, 'age', ageArr(), user.age ? [user.age] : [5])}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>品种</Text>
                <TextInput
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.breed}
                  placeholder='请输入狗狗的品种'
                  onChangeText={text => {
                    this.changeState('breed', text);
                  }}
                />
              </View>
            </ScrollView>
            <TouchableWithoutFeedback onPress={this._closePicker.bind(this)}>
              <View style={this.state.pickerVisible ? styles.mask : null}>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg: {
    width,
    height: 160,
  },
  bgImg: {
    width,
    height: 160
  },
  blur: {
    flex: 1,
  },
  foreground: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  info: {
    marginLeft: 20
  },
  uploadBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.2)',

  },
  uploadText: {
    fontSize: 12,
    color: '#fff'
  },
  foreImg: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  foreText: {
    color: '#fff',
    fontSize: 12
  },
  stickyHead: {
    height: 55,
    paddingTop: 25,
  },
  stickyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  gear: {
    position: 'absolute',
    top: 26,
    right: 15,
  },
  edit: {
    fontSize: 14,
    color: '#fff'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#eee'
  },
  head: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ed7b66'
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  cancelBtn: {
    position: 'absolute',
    padding: 5,
    top: 20,
    left: 5,
  },
  finishBtn: {
    position: 'absolute',
    padding: 5,
    top: 20,
    right: 5,
  },
  titleText: {
    fontSize: 14,
    color: '#fff',
  },
  fieldContainer: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
    height: 40,
    borderColor: '#eee',
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  label: {
    color: '#444',
    width: 50,
    marginRight: 20,
  },
  inputField: {
    fontSize: 12,
    height: 40,
    flex: 1,
    color: '#555',
  },
  mask: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  logout: {
    padding:10,
    marginHorizontal:20,
    marginTop:100,
    borderColor:'#ed7b66',
    borderWidth:1,
    borderRadius:8,
    color:'#ed7b66',
    fontSize:14,
  }
})
