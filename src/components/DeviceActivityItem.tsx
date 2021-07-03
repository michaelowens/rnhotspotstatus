import React, {ReactElement, useRef, useState} from 'react'
import {
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  Image,
  TouchableHighlight,
  Pressable,
  Animated,
  Easing,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IActivity from '../models/Activity'
import IHotspot from '../models/Hotspot'
import {getActivityType, getDetails, getRewardType} from '../utils'
import DeviceActivityItemDetails from './DeviceActivityItemDetails'
import Label from './Label'
import MyAppText from './MyAppText'

const DeviceActivityItem: React.FC<{
  item: IActivity
  style?: StyleProp<ViewStyle>
  hotspot: IHotspot
}> = ({item, style, hotspot}) => {
  const [hoveringOpener, setHoveringOpener] = useState(false)
  const [detailsOpened, setDetailsOpened] = useState(false)
  let detailsOpacityValue = useRef(new Animated.Value(0)).current
  const spinValue = useRef(new Animated.Value(0)).current
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  })
  const detailsOpacity = detailsOpacityValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const toggle = () => {
    let opening = !detailsOpened
    Animated.timing(spinValue, {
      toValue: detailsOpened ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()

    Animated.timing(detailsOpacityValue, {
      toValue: detailsOpened ? 0 : 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      if (!opening) {
        setDetailsOpened(false)
      }
    })

    if (opening) {
      setDetailsOpened(true)
    }
  }

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
    <>
      <View style={[styles.container, style]}>
        <MyAppText style={{width: 100}}>{timeString}</MyAppText>
        <Pressable
          style={{
            borderColor: hoveringOpener || detailsOpened ? 'white' : '#777',
            borderWidth: 1,
            borderRadius: 5,
            marginRight: 15,
          }}
          onPress={toggle}>
          <Animated.View
            style={{transform: [{rotate: spin}]}}
            onMouseEnter={() => setHoveringOpener(true)}
            onMouseLeave={() => setHoveringOpener(false)}>
            <Icon
              name="chevron-right"
              size={20}
              color={hoveringOpener || detailsOpened ? 'white' : '#777'}
            />
          </Animated.View>
        </Pressable>
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
                style={{marginTop: 1, marginRight: 3}}
                size={16}
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
      {detailsOpened && (
        <Animated.View
          style={{
            padding: 10,
            paddingLeft: 160,
            opacity: detailsOpacity,
          }}>
          <DeviceActivityItemDetails activity={item} hotspot={hotspot} />
        </Animated.View>
      )}
    </>
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
