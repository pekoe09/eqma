import React from 'react'
import ReactDOM from 'react-dom'

class Map extends React.Component {

  componentDidMount() {
    this.loadMap()
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props
      const maps = google.maps
      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)
      console.log('Node ', node)

      const mapConfig = Object.assign({}, {
        center: { lat: 60.261193, lng: 24.685342 },
        zoom: 11,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig)

      const marker = new google.maps.Marker({
        position: { lat: 60.261193, lng: 24.685342 },
        map: this.map,
        title: 'EcMa'
      })
    }
  }

  render() {
    const mapStyle = {
      width: '100%',
      height: '40vw'
    }

    return (
      <div ref="map" style={mapStyle}>
        Loading map...
      </div>
    )
  }
}

export default Map