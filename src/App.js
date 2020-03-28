import React, {useState, useEffect, useRef} from 'react';
import ReactMapGL, {Marker, NavigationControl, Popup} from 'react-map-gl'
import {OverlayTrigger, Popover} from 'react-bootstrap'
import axios from 'axios'
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css';


function App() {
  // Setup map initial state
  const [viewport, setViewPort] = useState({
    latitude: 45,
    longitude: -75,
    width: '70vw',
    height: '100vh',
    zoom: 5
  })
  const mapRef = useRef()


  // Get the data for COVID19
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('https://corona.lmao.ninja/countries')
    .then(res => setData(res.data))
    .catch(err => err)
  }, [0])


  // Show popups
  const [selected, setSelected ] = useState(null)
  console.log(selected)
  return (
    <div className="App">
     <ReactMapGL
       {...viewport}
       onViewportChange={viewport => {
         setViewPort(viewport)
       }}
       mapStyle='mapbox://styles/hectorsilvarobles/ck8auv43e0hx61ik91wbtd2ep'
       mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
       minZoom={2.5}
       ref={mapRef}
       >
       
       {data.map((val, index) => {
         return (
            <Marker 
              key={index} 
              longitude={val.countryInfo.long} 
              latitude={val.countryInfo.lat}
              anchor={'center'}
              offsetLeft={-20}
              offsetTop={-30}
              
            >
            
            <div 
            className='cluster' 
            style={ val.cases > 1000000 ? 
              {
                width: `250px`,
                height: `250px`,
              } 
              : 
              val.cases > 100000 && val.cases < 1000000 ? 
              {
                width: `120px`,
                height: `120px`,
              }
              :
              val.cases > 10000 && val.cases < 100000 ?
              {
                width: `70px`,
                height: `70px`,
              }
              :
              val.cases > 0 && val.cases < 10000 ? 
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
                }}
              > 
              </div>
            </Marker>
           )
       })}
       {selected ? (
                  <Popup
                    longitude={selected.countryInfo.long}
                    latitude={selected.countryInfo.lat}
                    onClose={() => setSelected(null)}
                    anchor={'left'}
                    offsetLeft={
                      selected.cases >  1000000 
                      ?
                      100
                      :
                      selected.cases < 1000000 && selected.cases > 100000 
                      ?
                      70
                      :
                      selected.cases < 100000 && selected.cases > 10000
                      ?
                      50
                      :
                      selected.cases < 10000 && selected.cases > 0
                      ?
                      20
                      :
                      5
                    }
                    tipSize={20}
                  >
                  <div>
                    <h1>{selected.country}</h1>
                    <h2>{selected.cases}</h2>
                  </div>
                  </Popup>
                ) : null}
       <div style={{position: 'absolute', right: 50, top: 50}}><NavigationControl showCompass={true} showZoom={true}/></div>
     </ReactMapGL>
    </div>
  );
}

export default App;
