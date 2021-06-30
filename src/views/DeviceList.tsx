import React, {useState, useEffect, useCallback} from 'react'
import {View, ScrollView} from 'react-native'
import {Route, useHistory} from 'react-router-native'
import DeviceListItem from '../components/DeviceListItem'
import MyAppText from '../components/MyAppText'
import {useSharedState} from '../store'
import IHotspot from '../models/Hotspot'
import AddDevice from './AddDevice'
import {getHotspots, getHotspotsRewards} from '../api'
import Device from './Device'

const DeviceRoute = ({match}) => {
  return match.params.deviceAddress === 'add' ? (
    <AddDevice />
  ) : (
    <Device address={match.params.deviceAddress} />
  )
}

const DeviceList = ({match}) => {
  let history = useHistory()
  const [state, setState] = useSharedState()
  const [devices, setDevices] = useState<IHotspot[]>([])
  const [rewards, setRewards] = useState({})

  const getData = useCallback(async () => {
    try {
      const hotspots = await getHotspots(Object.keys(state.devices))
      if (hotspots) {
        setDevices(hotspots)
        await fetchRewards(hotspots)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  async function fetchRewards(hotspots: IHotspot[]) {
    const date = new Date()
    const dateUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
    )
    const maxTime = new Date(dateUTC).toISOString()

    const params = new URLSearchParams({
      min_time: '-30 day',
      max_time: maxTime,
      bucket: 'day',
    })

    const rewards = await getHotspotsRewards(
      hotspots.map(hs => hs.address),
      params.toString(),
    )

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
  }

  return (
    <View style={{flex: 1}}>
      <Route path={`${match.url}/:deviceAddress`} component={DeviceRoute} />
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
