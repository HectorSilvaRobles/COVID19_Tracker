import React, {useState, useRef} from 'react'
import MapGL, {Source, Layer, Marker, NavigationControl, Popup, FlyToInterpolator} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';


function Map(props){
     // Setup map initial state
    const [viewport, setViewPort] = useState({
        latitude: 41.87,
        longitude: 12.56,
        width: '100vw',
        height: '90vh',
        zoom: 4,
        pitch: 40
    })
  const mapRef = useRef()

  // Show popups
  const [selected, setSelected ] = useState(null)
  
  return (
    <div className="map">
      <MapGL
       {...viewport}
       onViewportChange={viewport => {
         setViewPort(viewport)
       }}
       mapStyle='mapbox://styles/hectorsilvarobles/ck8auv43e0hx61ik91wbtd2ep'
       mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
       minZoom={3}
       ref={mapRef}
       >
      
       {props.data.map((val, index) => {
         const thelongitude = parseFloat(val.coordinates.longitude)
         const thelatitude = parseFloat(val.coordinates.latitude)

        if(thelatitude && thelongitude ){
         return (
            <Marker 
              key={index} 
              longitude={thelongitude} 
              latitude={thelatitude}
              anchor={'center'}
              offsetLeft={
                      val.stats.confirmed > 1000000 
                      ?
                      -80
                      :
                      val.stats.confirmed < 1000000 && val.stats.confirmed > 100000 
                      ?
                      -50
                      :
                      val.stats.confirmed < 100000 && val.stats.confirmed > 10000
                      ?
                      -20
                      :
                      val.stats.confirmed < 10000 && val.stats.confirmed > 0
                      ?
                      -10
                      :
                      0
              }
              offsetTop={
                      val.stats.confirmed > 1000000 
                      ?
                      -100
                      :
                      val.stats.confirmed < 1000000 && val.stats.confirmed > 100000 
                      ?
                      -70
                      :
                      val.stats.confirmed < 100000 && val.stats.confirmed > 10000
                      ?
                      -50
                      :
                      val.stats.confirmed < 10000 && val.stats.confirmed > 0
                      ?
                      -15
                      :
                      0
              }
            >
            
            <div 
            className='cluster' 
            style={ val.stats.confirmed > 1000000 ? 
              {
                width: `250px`,
                height: `250px`,
              } 
              : 
              val.stats.confirmed > 100000 && val.stats.confirmed < 1000000 ? 
              {
                width: `120px`,
                height: `120px`,
              }
              :
              val.stats.confirmed > 10000 && val.stats.confirmed < 100000 ?
              {
                width: `70px`,
                height: `70px`,
              }
              :
              val.stats.confirmed > 0 && val.stats.confirmed < 10000 ? 
              {
                width: '5px',
                height: '5px'
              }
              :
              {
                width: `0px`,
                height: `0px`,
              }
              }
              onClick={e => {
                e.preventDefault();
                setSelected(val)
                const newviewport = {
                  latitude: thelatitude,
                  longitude: thelongitude,
                  zoom: 5,
                  width: '100vw',
                  height: '100vh',
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionDuration: 500,
                  pitch: 50

                }
                setViewPort(newviewport)
                }}
              > 
              </div>
            </Marker>
           )
        }
       })}
       {selected ? (
                  <Popup
                    longitude={parseFloat(selected.coordinates.longitude)}
                    latitude={parseFloat(selected.coordinates.latitude)}
                    onClose={() => setSelected(null)}
                    anchor={'left'}
                    offsetLeft={
                      selected.stats.confirmed >  1000000 
                      ?
                      100
                      :
                      selected.stats.confirmed < 1000000 && selected.stats.confirmed > 100000 
                      ?
                      70
                      :
                      selected.stats.confirmed < 100000 && selected.stats.confirmed > 10000
                      ?
                      50
                      :
                      selected.stats.confirmed < 10000 && selected.stats.confirmed > 0
                      ?
                      20
                      :
                      5
                    }
                    tipSize={20}
                  >
                  <div id='popup'>
                    <div className='popup-header'>
                      <h1>{selected.country}</h1>
                      <h2>{selected.province}</h2>
                    </div>
                    <div className='popup-body'>
                      <div className='pb-data'>
                        <h1>Cases</h1>
                        <h2>{props.formatNumber(selected.stats.confirmed)}</h2>
                      </div>
                      <div className='pb-data-deaths'>
                        <h1>Deaths</h1>
                        <h2>{props.formatNumber(selected.stats.deaths)}</h2>
                      </div>
                      <div className='pb-data-recovered'>
                        <h1>Recovered</h1>
                        <h2>{props.formatNumber(selected.stats.recovered)}</h2>
                      </div>

                    </div>
                  </div>
                  </Popup>
          ) 
         : 
         null
         }
       <div style={{position: 'absolute', right: 50, top: 50}}><NavigationControl showCompass={true} showZoom={true}/></div>
     </MapGL>
    </div>
  );
}

export default Map