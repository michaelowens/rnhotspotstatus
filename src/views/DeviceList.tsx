import React, {useState, useEffect} from 'react'
import {TouchableOpacity, View, Button, ScrollView} from 'react-native'
import {Route, useHistory} from 'react-router-native'
import {useToast} from 'react-native-fast-toast'
import DeviceListItem from '../components/DeviceListItem'
import MyAppText from '../components/MyAppText'
import MyTextInput from '../components/MyTextInput'
import IDevice from '../models/Device'
import {useSharedState} from '../store'

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

const Device = ({match}) => {
  return match.params.deviceAddress === 'add' ? (
    <AddDevice />
  ) : (
    <View style={{padding: 10}}>
      <MyAppText>Device: {match.params.deviceAddress}</MyAppText>
    </View>
  )
}

const DeviceList = ({match}) => {
  let history = useHistory()
  const [state, setState] = useSharedState()
  const [devices, setDevices] = useState([])
  const [rewards, setRewards] = useState({})

  useEffect(() => {
    const deviceCalls = []
    for (let addr of Object.keys(state.devices)) {
      deviceCalls.push(fetch(`https://api.helium.io/v1/hotspots/${addr}`))
    }

    Promise.all(deviceCalls)
      .then(results => Promise.all(results.map(r => r.json())))
      .then(hotspots => {
        hotspots = hotspots.map(h => h.data)
        setDevices(hotspots)
        return hotspots
      })
      .then(fetchRewards)
      .catch(err => console.error(err))
  }, [])

  function fetchRewards(hotspots) {
    const rewardCalls = []
    for (let hs of hotspots) {
      rewardCalls.push(
        fetch(
          `https://api.helium.io/v1/hotspots/${hs.address}/rewards/sum?min_time=-30%20day&max_time=2021-06-28T14%3A55%3A13.897Z&bucket=day`,
        ),
      )
    }

    Promise.all(rewardCalls)
      .then(results => Promise.all(results.map(r => r.json())))
      .then(rewards => {
        let newRewards = {}
        for (let i in rewards) {
          let {data} = rewards[i]
          let hotspot = hotspots[i]
          newRewards[hotspot.address] = {
            today: parseFloat(data[0]?.total.toFixed(2)) || 0,
            yesterday: parseFloat(data[1]?.total.toFixed(2)) || 0,
            month:
              parseFloat(
                data.reduce((acc, cur) => acc + cur.total, 0).toFixed(2),
              ) || 0,
          }
        }
        setRewards(newRewards)
        // setDevices(hotspots)
        console.log({newRewards})
      })
      .catch(err => console.error(err))
  }

  return (
    <View style={{flex: 1}}>
      <Route path={`${match.url}/:deviceAddress`} component={Device} />
      <Route
        exact
        path={match.url}
        render={() => (
          <View style={{flex: 1}}>
            <View
              style={{
                padding: 30,
                paddingTop: 20,
                paddingBottom: 10,
                flexDirection: 'row',
              }}>
              <MyAppText style={{marginRight: 10, width: 40}}>Type</MyAppText>
              <MyAppText style={{marginRight: 10, flex: 1}}>Device</MyAppText>
              <MyAppText style={{marginRight: 10, width: 70}}>Today</MyAppText>
              <MyAppText style={{marginRight: 10, width: 70}}>
                Yesterday
              </MyAppText>
              <MyAppText style={{width: 70}}>30 Days</MyAppText>
            </View>
            <ScrollView style={{flex: 1}}>
              <View
                style={{
                  paddingTop: 0,
                  padding: 15,
                }}>
                {/* <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#202223',
                    padding: 10,
                    borderRadius: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 5,
                    marginTop: 0,
                  }}
                  onPress={() => {
                    history.push('/devices/add')
                  }}>
                  <MyAppText
                    style={{
                      color: '#a8a195',
                      fontSize: 48,
                      lineHeight: 40,
                      width: 50,
                      textAlign: 'center',
                      marginTop: -20,
                      marginBottom: -15,
                    }}>
                    +
                  </MyAppText>
                  <MyAppText
                    style={{
                      color: '#a8a195',
                      fontWeight: '500',
                      fontSize: 18,
                      marginLeft: 10,
                      alignSelf: 'center',
                    }}>
                    Add new device
                  </MyAppText>
                </TouchableOpacity> */}
                <View
                  style={{
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {devices.map(hotspot => (
                    <DeviceListItem
                      key={hotspot.address}
                      device={state.devices[hotspot.address]}
                      rewards={rewards[hotspot.address]}
                      hotspot={hotspot}
                      style={{margin: 5}}
                    />
                  ))}
                  {/* <DeviceListItem
                type="longapone"
                style={{margin: 5}}
                address="shtnevyo3vu786vwfvthynqo23vkj23o"
              />
              <DeviceListItem
                type="longaplight"
                name="Fabled Unicorn Chimpanzee"
                address="nntc8r1n9c8lpc1p3c1c823lk189k891l2k98123"
                style={{margin: 5}}
              />
              <DeviceListItem
                type="axe"
                name="Axe Swinging Peso"
                address="389247qkdvrtn2378wkq2p4wq47k8qv9d"
                style={{margin: 5}}
              /> */}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      />
    </View>
  )
}

export default DeviceList
