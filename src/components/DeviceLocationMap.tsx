import React from 'react'
import {View} from 'react-native'
import {WebView} from 'react-native-webview'
import IHotspot from '../models/Hotspot'

const mapboxToken =
  'pk.eyJ1IjoieGlrZW9uIiwiYSI6ImNrYjBraWl1OTA1eXkzMWxvd3Bsb2g2b2MifQ.Mh6jYBDzkrWCBK2PwG6HzA'

const DeviceLocationMap: React.FC<{hotspot: IHotspot}> = ({hotspot}) => {
  const html = `
  <html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
    <style>
    * { -webkit-user-select: none; user-select: none; }
    html,body { margin: 0; padding: 0 }
    #mapid { width: 100%; height: 100%; }
    #attribution {
      position: fixed;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, .3);
      z-index: 100000;
      color: #aaa;
      font-size: 12px;
      padding: 4px;
      font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
    }
    </style>
  </head>
  <body>
    <div id="mapid"></div>
    <div id="attribution">© Mapbox © OpenStreetMap</div>
    <script>
    var mymap = L.map('mapid', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false
    }).setView([${hotspot.lat}, ${hotspot.lng}], 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 14,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: '${mapboxToken}'
    }).addTo(mymap);
    var marker = L.circleMarker([${hotspot.lat}, ${hotspot.lng}], {radius: 5}).addTo(mymap);
    </script>
  </body>
  </html>
  `

  return (
    <View style={{height: 250}}>
      <WebView
        originWhitelist={['*']}
        source={{html}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        style={{backgroundColor: 'transparent'}}
      />
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: '#00000000',
        }}></View>
    </View>
  )
}

export default DeviceLocationMap
