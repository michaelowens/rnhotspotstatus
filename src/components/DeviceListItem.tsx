import React from 'react'
import {Image, TouchableOpacity, View, ViewStyle} from 'react-native'
import {Redirect} from 'react-router-native'
import IDevice from '../models/Device'
import IHotspot from '../models/Hotspot'
import {humanReadableName, isRelayed} from '../utils'
import MyAppText from './MyAppText'
import StatusLight from './StatusLight'

const defaultDeviceStyle: ViewStyle = {
  flex: 1,
  backgroundColor: '#202223',
  padding: 10,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'row',
}

class DeviceListItem extends React.Component<{
  device: IDevice
  hotspot: IHotspot
  style?: ViewStyle
  type?: string
  name?: string
  rewards?: any
}> {
  state = {redirectToDevice: false}

  getDeviceImage(type: string) {
    switch (type) {
      case 'longapone':
        return require(`../assets/longapone.png`)
      case 'longaplight':
        return require(`../assets/longaplight.png`)
      case 'axe':
        return require(`../assets/axe.png`)
      default:
        return require(`../assets/generic.png`)
    }
  }

  render() {
    if (this.state.redirectToDevice) {
      return <Redirect to={'devices/' + this.props.device.address} />
    }

    return (
      <TouchableOpacity
        style={[defaultDeviceStyle, this.props.style]}
        onPress={() => this.setState({redirectToDevice: true})}>
        {this.props.device.type && (
          <Image
            source={this.getDeviceImage(this.props.device.type)}
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              opacity: this.props.device.type === 'generic' ? 0.7 : 1,
            }}
          />
        )}
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <MyAppText
                style={{
                  fontWeight: '500',
                  fontSize: 18,
                  marginBottom: 4,
                }}>
                {humanReadableName(
                  this.props.device.name ?? 'Frankly Fake Devicename',
                )}
              </MyAppText>
              {isRelayed(this.props.hotspot.status.listen_addrs) && (
                <StatusLight status="relayed" />
              )}
              <StatusLight status={this.props.hotspot.status.online} />
            </View>
            <MyAppText style={{fontWeight: '300'}}>
              Reward scale:{' '}
              {parseFloat(this.props.hotspot.reward_scale?.toFixed(1) || '0')}
            </MyAppText>
          </View>
          <View style={{width: 70, marginRight: 10}}>
            <MyAppText>{this.props.rewards?.today}</MyAppText>
          </View>
          <View style={{width: 70, marginRight: 10}}>
            <MyAppText>{this.props.rewards?.yesterday}</MyAppText>
          </View>
          <MyAppText style={{width: 70}}>{this.props.rewards?.month}</MyAppText>
        </View>
      </TouchableOpacity>
    )
  }
}

export default DeviceListItem
