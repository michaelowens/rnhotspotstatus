import React from 'react'
import {Route, Link} from 'react-router-native'
import MyAppText from './MyAppText'

const NavigationLink: React.FC = ({
  children,
  to,
  activeOnlyWhenExact,
  style,
}) => {
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      children={({match}) => (
        <Link
          style={[{backgroundColor: match ? '#3730A3' : null}, style]}
          underlayColor="#3730A3"
          to={to}>
          <MyAppText style={{padding: 10, flexDirection: 'row'}}>
            {children}
          </MyAppText>
        </Link>
      )}
    />
  )
}

export default NavigationLink
