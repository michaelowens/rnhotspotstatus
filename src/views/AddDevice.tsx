import React, {useState} from 'react'
import {View, Button} from 'react-native'
import {useToast} from 'react-native-fast-toast'
import {useHistory} from 'react-router-native'
import {useSharedState} from '../store'
import MyAppText from '../components/MyAppText'
import MyTextInput from '../components/MyTextInput'
import IDevice from '../models/Device'

const AddDevice: React.FC = () => {
  let history = useHistory()
  const toast = useToast()
  const [state, setState] = useSharedState()
  const [deviceAddress, setDeviceAddress] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')

  const addDevice = (device: IDevice) => {
    const devices = state.devices
    devices[device.address] = device
    setState(prev => ({...prev, devices}))
    toast.show('Hotspot added successfully', {type: 'success'})
  }

  const addDevices = (newDevices: IDevice[]) => {
    const devices = state.devices
    for (let device of newDevices) {
      devices[device.address] = device
    }
    setState(prev => ({...prev, devices}))
    toast.show('Account imported successfully', {type: 'success'})
  }

  async function importDevice() {
    // TODO: add feedback when device already exists
    if (deviceAddress in state.devices) {
      toast.show('Hotspot already added', {
        type: 'danger',
      })
      return
    }

    const response = await fetch(
      `https://api.helium.io/v1/hotspots/${deviceAddress}`,
    )
    const {data} = await response.json()
    let {address, name} = data
    const hs: IDevice = {
      address,
      name,
      type: 'generic',
    }
    addDevice(hs)
    history.push('/devices')
  }

  async function importFromOwner() {
    const response = await fetch(
      `https://api.helium.io/v1/accounts/${ownerAddress}/hotspots`,
    )
    const {data} = await response.json()
    let hotspots: IDevice[] = []
    for (let device of data) {
      let {address, name} = device
      hotspots.push({
        address,
        name,
        type: 'generic',
      })
    }
    addDevices(hotspots)
    history.push('/devices')
  }

  return (
    <View style={{padding: 10}}>
      <MyAppText>Add new device by network address</MyAppText>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <MyTextInput
          value={deviceAddress}
          onChangeText={text => setDeviceAddress(text)}
          style={{flex: 1, marginRight: 10}}
        />
        <Button title="Add" onPress={importDevice} color="#3730A3" />
      </View>
      <MyAppText style={{marginTop: 20}}>
        Or import all devices from owner address
      </MyAppText>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <MyTextInput
          value={ownerAddress}
          onChangeText={text => setOwnerAddress(text)}
          style={{flex: 1, marginRight: 10}}
        />
        <Button title="Import" onPress={importFromOwner} color="#3730A3" />
      </View>
    </View>
  )
}

export default AddDevice
