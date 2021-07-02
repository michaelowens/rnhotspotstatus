interface IHotspot {
  address: string
  name: string
  type: string
  owner: string
  status: IHotspotStatus
  mode: string
  timestamp_added: string
  reward_scale: number | null
  gain: number
  elevation: number
  block: number
  block_added: number
  geocode: IHotspotGeocode
  lng: number
  lat: number
}

export interface IHotspotStatus {
  online: string
  listen_addrs: string[] | null
  height: number
}

export interface IHotspotGeocode {
  short_street: string
  short_state: string
  short_country: string
  short_city: string
  long_street: string
  long_state: string
  long_country: string
  long_city: string
  city_id: string
}

export default IHotspot
