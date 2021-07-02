import React from 'react'
import {View} from 'react-native'
import {getStatusColor} from '../utils'

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
