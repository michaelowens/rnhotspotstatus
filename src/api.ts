import IHotspot from './models/Hotspot'

export const heliumApi = async (path: string) =>
  fetch('https://api.helium.io/v1/' + path)

export const getHotspot = async (address: string) =>
  heliumApi('hotspots/' + address)
    .then(result => result.json())
    .catch(err => console.error(err))

export const getHotspots = async (addresses: string[]) => {
  const calls = addresses.map(addr => heliumApi('hotspots/' + addr))
  return Promise.all(calls)
    .then(results => Promise.all(results.map(r => r.json())))
    .then(responses => responses.map(h => h.data as IHotspot))
    .catch(err => console.error(err))
}

export const getHotspotRewards = async (address: string, query: string) =>
  heliumApi(`hotspots/${address}/rewards/sum?${query}`)
    .then(result => result.json())
    .catch(err => console.error(err))

export const getHotspotsRewards = async (
  addresses: string[],
  query: string,
) => {
  const calls = addresses.map(addr =>
    heliumApi(`hotspots/${addr}/rewards/sum?${query}`),
  )
  return Promise.all(calls)
    .then(results => Promise.all(results.map(r => r.json())))
    .catch(err => console.error(err))
}

export const getHotspotActivity = async (address: string) => {
  let responseData = []
  return heliumApi(`hotspots/${address}/activity`)
    .then(result => result.json())
    .then(({data, cursor}) => {
      responseData = data
      return heliumApi(`hotspots/${address}/activity?cursor=${cursor}`)
    })
    .then(result => result.json())
    .then(({data}) => (responseData = responseData.concat(data)))
    .catch(err => console.error(err))
}
