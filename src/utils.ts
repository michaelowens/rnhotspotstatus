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
