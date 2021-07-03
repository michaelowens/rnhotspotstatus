import IActivity from './models/Activity'
import IHotspot from './models/Hotspot'

export const humanReadableName = (name: string) =>
  name
    .split('-')
    .map(part => part[0].toUpperCase() + part.substr(1))
    .join(' ')

export const isRelayed = (listenAddr: string[] | null) =>
  listenAddr && listenAddr.length > 0 && listenAddr[0].includes('p2p')

export const getStatusColor = (status: string) => {
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

export const getActivityType = (activity: IActivity, address: string) => {
  switch (activity.type) {
    case 'poc_request_v1':
      return {name: 'PoC Challenger', color: '#21a974'}

    case 'rewards_v2':
      return {name: 'Mining Reward', color: '#b86f00'}

    case 'state_channel_close_v1':
      return {name: 'Packets Transferred', color: '#006666'}

    case 'poc_receipts_v1':
      if (activity.challenger === address)
        return {name: 'Challenger', color: '#480087'}
      if (activity.path[0].challengee === address)
        return {name: 'Beacon', color: '#47487b'}
      return {name: 'Witness', color: '#8d5800'}

    case 'consensus_group_v1':
      return {name: 'Consensus Election', color: '#8f0000'}

    default:
      return {name: activity.type, color: '#333'}
  }
}

export const deg2rad = (deg: number) => deg * (Math.PI / 180)

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  var R = 6371 // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1) // deg2rad below
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c // Distance in km
  return d
}

export const getDetails = (activity: IActivity, hotspot: IHotspot) => {
  switch (activity.type) {
    // case 'poc_request_v1':
    //   return '${color 29D391}PoC Challenger${color}'

    case 'rewards_v2':
      const totalReward =
        activity.rewards.reduce((acc, cur) => acc + cur.amount, 0) / 100000000
      return `${totalReward.toFixed(2)} HNT`

    case 'state_channel_close_v1':
      const dc = activity.state_channel?.summaries.reduce(
        (acc, cur) => acc + cur.num_dcs,
        0,
      )
      return `${dc} DC`

    case 'poc_receipts_v1':
      if (activity.path[0].challengee === hotspot.address) return '' // activity.path[0].witnesses.length + ' witnesses'

      let distance = ''

      if (activity.challenger !== hotspot.address) {
        const {challengee_lat, challengee_lon} = activity.path[0]
        const distanceKm = getDistanceFromLatLonInKm(
          hotspot.lat,
          hotspot.lng,
          challengee_lat,
          challengee_lon,
        ).toFixed(1)

        if (distanceKm) {
          distance = `${distanceKm}km, `
        }
      }

      const {short_country, long_city} = activity.path[0].geocode
      return `${distance}${long_city}, ${short_country}`

    default:
      return ''
  }
}

export const getRewardType = (type: string) => {
  switch (type) {
    case 'poc_challengers':
      return {name: 'Challenger', color: '#480087'}

    case 'poc_witnesses':
      return {name: 'Witness', color: '#8d5800'}

    case 'poc_challengees':
      return {name: 'Beacon', color: '#47487b'}

    case 'data_credits':
      return {name: 'Data Credits', color: '#006666'}

    // case 'poc_receipts_v1':
    //   if (activity.challenger === address)
    //     return {name: 'Challenger', color: '#480087'}
    //   if (activity.path[0].challengee === address)
    //     return {name: 'Beacon', color: '#47487b'}
    //   return {name: 'Witness', color: '#8d5800'}

    // case 'consensus_group_v1':
    //   return {name: 'Consensus Election', color: '#8f0000'}

    default:
      return {name: type, color: '#333'}
  }
}
