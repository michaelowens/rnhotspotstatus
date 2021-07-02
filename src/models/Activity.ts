import {IHotspotGeocode} from './Hotspot'

interface IActivity {
  type: string
  time: number
  hash: string
  height: number
  start_epoch?: number
  end_epoch?: number
  rewards?: IActivityReward[]
  path?: IActivityPath[]
  secret?: string
  request_block_hash?: string
  onion_key_hash?: string
  fee?: number
  challenger_owner?: string
  challenger_lon?: number
  challenger_location?: string
  challenger_lat?: number
  challenger?: string
  version?: number
  block_hash?: string
  state_channel?: IActivityStateChannel
  conflicts_with?: any
  closer?: string
}

export interface IActivityReward {
  type: string
  gateway: string
  amount: number
  account: string
}

export interface IActivityPath {
  challengee_owner: string
  challengee_lon: number
  challengee_location_hex: string
  challengee_location: string
  challengee_lat: number
  challengee: string
  witnesses: IActivityPathWitness[]
  receipt: IActivityPathReceipt
  geocode: IHotspotGeocode
}

export interface IActivityPathWitness {
  timestamp: number
  snr: number
  signal: number
  packet_hash: string
  owner: string
  location_hex: string
  location: string
  is_valid: boolean
  gateway: string
  frequency: number
  datarate: string
  channel: number
}

export interface IActivityPathReceipt {
  timestamp: number
  snr: number
  signal: number
  origin: string
  gateway: string
  frequency: number
  datarate: any
  data: string | null
  channel: number
}

export interface IActivityStateChannel {
  summaries: IActivityStateChannelSummary[]
  state: string
  root_hash: string
  owner: string
  nonce: number
  id: string
  expire_at_block: number
}

export interface IActivityStateChannelSummary {
  owner: string
  num_packets: number
  num_dcs: number
  location: string
  client: string
}

export default IActivity
