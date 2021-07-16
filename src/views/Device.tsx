import React, {useCallback, useEffect, useState} from 'react'
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native'
import {getHotspot, getHotspotActivity, getHotspotRewards} from '../api'
import BarChart from '../components/BarChart'
import DeviceActivityItem from '../components/DeviceActivityItem'
import DeviceLocationMap from '../components/DeviceLocationMap'
import Label from '../components/Label'
import MyAppText from '../components/MyAppText'
import IActivity from '../models/Activity'
import IHotspot from '../models/Hotspot'
import {getStatusColor, humanReadableName, isRelayed} from '../utils'

const Device: React.FC = ({match}) => {
  const address = match.params.deviceAddress
  const [hotspot, setHotspot] = useState<IHotspot>()
  const [rewards, setRewards] = useState({
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    alltime: 0,
    daily: [],
  })
  const [activity, setActivity] = useState<IActivity[]>([])

  const getData = useCallback(async () => {
    try {
      const {data} = await getHotspot(address)

      if (data) {
        setHotspot(data)
        fetchRewards(data)
        fetchActivity(data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  async function fetchRewards(hs: IHotspot) {
    console.log('fetching rewards', hs)

    const date = new Date()
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    const dateUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    )
    const maxTime = new Date(dateUTC).toISOString()

    const params = new URLSearchParams({
      min_time: '-30 day',
      max_time: maxTime,
      bucket: 'day',
    })

    const {data} = await getHotspotRewards(address, params.toString())

    const paramsSum = new URLSearchParams({
      min_time: hs.timestamp_added,
      max_time: maxTime,
    })
    const {data: dataSum} = await getHotspotRewards(
      address,
      paramsSum.toString(),
    )

    let newRewards = {
      today: parseFloat(data[0]?.total.toFixed(2)) || 0,
      yesterday: parseFloat(data[1]?.total.toFixed(2)) || 0,
      week:
        parseFloat(
          data
            .slice(0, 7)
            .reduce((acc, cur) => acc + cur.total, 0)
            .toFixed(2),
        ) || 0,
      month:
        parseFloat(data.reduce((acc, cur) => acc + cur.total, 0).toFixed(2)) ||
        0,
      alltime: parseFloat(dataSum.total.toFixed(2)) || 0,
      daily: data.map(r => r.total),
    }

    setRewards(newRewards)
  }

  async function fetchActivity(hs: IHotspot) {
    const data = await getHotspotActivity(address)
    setActivity(data)
  }

  useEffect(() => {
    getData()
  }, [getData])

  // TODO: proper loading check
  if (!hotspot) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const nameSize = 32
  let prevDateString = ''

  return (
    <View style={{flex: 1}}>
      <View style={{height: 250}}>
        <DeviceLocationMap hotspot={hotspot} />
        <View style={{padding: 20, position: 'absolute'}}>
          <View style={{flexDirection: 'row'}}>
            <MyAppText
              style={{
                fontSize: nameSize,
                position: 'absolute',
                margin: 2,
                color: '#000',
              }}>
              {hotspot && humanReadableName(hotspot.name)}
            </MyAppText>
            <MyAppText style={{fontSize: nameSize}}>
              {hotspot && humanReadableName(hotspot.name)}
            </MyAppText>
          </View>
          <MyAppText style={{fontSize: 12}}>{hotspot.address}</MyAppText>
          <View style={{flexDirection: 'row'}}>
            <Label
              title="online"
              color={getStatusColor(hotspot.status.online)}
            />
            {isRelayed(hotspot.status.listen_addrs) && (
              <Label
                title="relayed"
                color={getStatusColor('relayed')}
                style={{marginLeft: 5}}
              />
            )}
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 20}}>
          <View
            style={[styles.box, {marginBottom: 10, flexDirection: 'column'}]}>
            <MyAppText style={{fontSize: 18, marginBottom: 5}}>
              Rewards
            </MyAppText>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <View>
                <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                  {rewards.today}
                </MyAppText>
                <MyAppText style={{alignSelf: 'center'}}>Today</MyAppText>
              </View>
              <View>
                <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                  {rewards.yesterday}
                </MyAppText>
                <MyAppText style={{alignSelf: 'center'}}>Yesterday</MyAppText>
              </View>
              <View>
                <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                  {rewards.week}
                </MyAppText>
                <MyAppText style={{alignSelf: 'center'}}>Last Week</MyAppText>
              </View>
              <View>
                <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                  {rewards.month}
                </MyAppText>
                <MyAppText style={{alignSelf: 'center'}}>Last Month</MyAppText>
              </View>
              <View>
                <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                  {rewards.alltime}
                </MyAppText>
                <MyAppText style={{alignSelf: 'center'}}>All time</MyAppText>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{marginRight: 10, width: 315}}>
              <View
                style={[styles.box, {flexDirection: 'column', height: 120}]}>
                <MyAppText style={{marginBottom: 10, fontSize: 18}}>
                  30 Days - Rewards
                </MyAppText>
                <BarChart data={rewards.daily}></BarChart>
              </View>
            </View>
            <View
              style={[
                styles.box,
                {
                  marginBottom: 20,
                  flexDirection: 'column',
                  maxWidth: 1000,
                  flex: 1,
                },
              ]}>
              {activity.map(item => {
                const date = new Date(item.time * 1000)
                const newDateString = date.toLocaleDateString(
                  navigator.language,
                  {
                    month: 'short',
                    day: 'numeric',
                  },
                )
                let dateString = ''
                let marginTop = 0
                if (prevDateString !== newDateString) {
                  marginTop = prevDateString ? 10 : 0
                  dateString = newDateString
                  prevDateString = newDateString
                }

                return (
                  <React.Fragment key={item.hash}>
                    {!!dateString && (
                      <View style={{marginBottom: 10, marginTop}}>
                        <MyAppText style={{fontSize: 18}}>
                          {dateString}
                        </MyAppText>
                      </View>
                    )}
                    <View
                      style={{
                        marginBottom: 10,
                      }}>
                      <DeviceActivityItem item={item} hotspot={hotspot} />
                    </View>
                  </React.Fragment>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#202223',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
})

export default Device
