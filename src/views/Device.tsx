import React, {useCallback, useEffect, useState} from 'react'
import {View} from 'react-native'
import {getHotspot} from '../api'
import MyAppText from '../components/MyAppText'
import IHotspot from '../models/Hotspot'

const Device: React.FC<{address: string}> = ({address}) => {
  const [hotspot, setHotspot] = useState<IHotspot>()
  const [rewards, setRewards] = useState({})

  const getData = useCallback(async () => {
    try {
      const {data} = await getHotspot(address)

      if (data) {
        setHotspot(data)
        // await fetchRewards(hotspots)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <View style={{padding: 20}}>
      <MyAppText>Device: {hotspot?.name}</MyAppText>
    </View>
  )
}

export default Device
