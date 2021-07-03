import React from 'react'
import {View} from 'react-native'
import IActivity from '../models/Activity'
import IHotspot from '../models/Hotspot'
import {getRewardType} from '../utils'
import Label from './Label'
import MyAppText from './MyAppText'

const DeviceActivityItemDetails: React.FC<{
  activity: IActivity
  hotspot: IHotspot
}> = ({activity, hotspot}) => {
  if (activity.type === 'rewards_v2') {
    if (!activity.rewards || !activity.rewards.length) {
      return <></>
    }

    return activity.rewards.map((reward, rewardIndex) => {
      const rewardType = getRewardType(reward.type)
      return (
        <View
          key={rewardIndex}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Label
            title={rewardType.name}
            color={rewardType.color}
            outline
            style={{width: 160}}
          />
          <MyAppText style={{marginLeft: 10, color: '#888'}}>
            {(reward.amount / 100000000).toFixed(2)} HNT
          </MyAppText>
        </View>
      )
    })
  }

  return <></>
}

export default DeviceActivityItemDetails
