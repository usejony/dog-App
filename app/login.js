import React, { Component } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	AsyncStorage,
	Alert,
} from 'react-native';

import Button from 'react-native-button';

import config from '../common/config';
import { POST } from '../common/request';

const { width } = Dimensions.get('window');
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			phoneNumber: '',
			verifyCode: '',
			codeSent: false,
		}
	}

	_sendVerifyCode() {
		const phoneNumber = this.state.phoneNumber;
		if (!phoneNumber) {
			return Alert.alert('手机号不能为空');
		}
		const signup = config.api.base + config.api.signup;
		const body = {
			phoneNumber: phoneNumber
		};
		POST(signup, body)
			.then(data => {
				if (data && data.success) {
					this.setState({
						codeSent: true,
					})
				} else {
					Alert.alert('获取验证码失败！');
				}
			})
			.catch(err => {
				Alert.alert('获取验证码失败，请检查网络');
			});

	}
	_sending() {
		const phoneNumber = this.state.phoneNumber;
		const verifyCode = this.state.verifyCode;
		if (!phoneNumber || !verifyCode) {
			return Alert.alert('手机号或验证码不能为空');
		}
		const url = config.api.base + config.api.verify;
		const body = {
			phoneNumber: this.state.phoneNumber,
			verifyCode: this.state.verifyCode,
		}
		POST(url, body)
			.then(data => {
				if (data && data.success) {
					this.props.afterLogin(data);
					console.log(data);
				}
			})
			.catch(err => {
				consoe.log(err);
			})
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.head}>
					<Text style={styles.headTitle}>快速登录</Text>
				</View>
				<View style={styles.inputBox}>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus={true}
						keyboardType="numeric"
						placeholder="请输入手机号"
						style={styles.phoneNumber}
						onChangeText={(text) => {
							this.setState({
								phoneNumber: text,
							});
						}} />
				</View>
				{
					this.state.codeSent
						? <View style={styles.verifyBox}>
							<TextInput
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="numeric"
								placeholder="验证码"
								style={styles.verifyNumber}
								onChangeText={(text) => {
									this.setState({
										verifyCode: text,
									})
								}} />
							<TouchableOpacity onPress={() => alert('agin')} style={styles.verifyBtn}>
								<Text style={styles.verifyAginText}>重新获取验证码</Text>
							</TouchableOpacity>
						</View>
						: null
				}
				<View style={styles.sendBox}>
					{
						!this.state.codeSent
							? <Button style={styles.getCode} onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
							: <Button style={styles.login} onPress={this._sending.bind(this)}>登录</Button>
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
		height: 55,
		paddingTop: 20,
	},
	headTitle: {
		fontSize: 18,
		color: '#555',
		textAlign: 'center',
	},
	inputBox: {
		height: 35,
		margin: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		backgroundColor: '#fff',
	},
	phoneNumber: {
		flex: 1,
		color: '#666',
		fontSize: 16,
		paddingLeft: 20
	},
	verifyBox: {
		height: 40,
		marginHorizontal: 10,
		marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	verifyNumber: {
		width: 150,
		height: 40,
		borderWidth: 1,
		borderColor: '#eee',
		textAlign: 'center',
	},
	verifyBtn: {
		padding: 11,
		borderWidth: 1,
		borderColor: '#ed7b66',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	verifyAginText: {
		color: '#ed7b66',
	},
	getCode: {
		marginTop: 35,
		width: width - 30,
		alignSelf: 'center',
		borderColor: '#ed7b66',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		alignItems: 'center',
		color: '#ed7b66',
	},
	login: {
		marginTop: 35,
		width: width - 30,
		alignSelf: 'center',
		borderColor: '#ed7b66',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		alignItems: 'center',
		color: '#fff',
		backgroundColor: '#ed7b66',
		overflow: 'hidden'
	}
})