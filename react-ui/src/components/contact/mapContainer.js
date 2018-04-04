import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react'
import Map from './map'

class MapContainer extends React.Component {
  render() {
    return (
      <Map google={this.props.google} />
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyChAhy5dg_ster1-vwKSuu24cuaLhEFVQQ'
})(MapContainer)