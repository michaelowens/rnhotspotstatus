export const humanReadableName = (name: string) =>
  name
    .split('-')
    .map(part => part[0].toUpperCase() + part.substr(1))
    .join(' ')
