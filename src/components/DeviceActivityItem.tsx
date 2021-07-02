import React from 'react'
import {View, StyleProp, StyleSheet, ViewStyle, Image} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IActivity from '../models/Activity'
import IHotspot from '../models/Hotspot'
import {getActivityType, getDetails} from '../utils'
import Label from './Label'
import MyAppText from './MyAppText'

const DeviceActivityItem: React.FC<{
  item: IActivity
  style?: StyleProp<ViewStyle>
  hotspot: IHotspot
}> = ({item, style, hotspot}) => {
  const type = getActivityType(item, hotspot.address)
  const date = new Date(item.time * 1000)
  const timeString = date.toLocaleTimeString(navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
  })

  const details = getDetails(item, hotspot)
  let witnesses = null
  if (item.path && item.path.length) {
    witnesses = item.path[0].witnesses.length
  }

  return (
    <View style={[styles.container, style]}>
      <MyAppText style={{width: 100}}>{timeString}</MyAppText>
      <Label
        title={type.name}
        size="large"
        style={{
          width: 170,
          alignContent: 'center',
          backgroundColor: type.color,
          marginRight: 10,
        }}
        bold
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        {item.path && item.path[0].geocode.short_country && !!details && (
          <Image
            source={{
              uri: `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${item.path[0].geocode.short_country.toLowerCase()}.svg`,
              width: 16,
              height: 12,
            }}
            style={{marginRight: 5, marginTop: 2}}
          />
        )}
        {!!details && (
          <MyAppText style={{marginRight: 10}}>{details}</MyAppText>
        )}
        {witnesses !== null && (
          <>
            <Icon
              name="remove-red-eye"
              style={{marginTop: 3, marginRight: 3}}
              color="#FCC945"
            />
            <MyAppText>{witnesses}</MyAppText>
          </>
        )}
      </View>
      <MyAppText style={{minWidth: 100, textAlign: 'right'}}>
        {item.height.toLocaleString()}
      </MyAppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
})

export default DeviceActivityItem
