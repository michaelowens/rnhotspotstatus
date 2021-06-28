import React from 'react'
import {View} from 'react-native'

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return '#21a974'
    case 'offline':
      return '#8e0404'
    case 'relayed':
      return '#a27503'
    default:
      return '#969696'
  }
}

const StatusLight: React.FC<{status: string}> = props => {
  return (
    <View
      style={{
        backgroundColor: getStatusColor(props.status),
        width: 10,
        height: 10,
        borderRadius: 10,
        marginLeft: 5,
      }}></View>
  )
}

export default StatusLight
