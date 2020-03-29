import React, {useState, useEffect, useRef} from 'react';
import ReactMapGL, {Marker, NavigationControl, Popup, FlyToInterpolator} from 'react-map-gl'
import axios from 'axios'
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css';


function App() {
  // Setup map initial state
  const [viewport, setViewPort] = useState({
    latitude: 41.87,
    longitude: 12.56,
    width: '80vw',
    height: '100vh',
    zoom: 3.5
  })
  const mapRef = useRef()  


  // Get the data for COVID19
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('https://corona.lmao.ninja/countries')
    .then(res => setData(res.data))
    .catch(err => err)
  }, [0])
  

  // Add commas to number
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


  // Show popups
  const [selected, setSelected ] = useState(null)

  return (
    <div className="App">
      <div className='left-side'>
        <h1>Stay Safe and remember to wash your hands!</h1>
      </div>
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
              offsetLeft={
                      val.cases > 1000000 
                      ?
                      -80
                      :
                      val.cases < 1000000 && val.cases > 100000 
                      ?
                      -50
                      :
                      val.cases < 100000 && val.cases > 10000
                      ?
                      -20
                      :
                      val.cases < 10000 && val.cases > 0
                      ?
                      -10
                      :
                      0
              }
              offsetTop={
                      val.cases > 1000000 
                      ?
                      -100
                      :
                      val.cases < 1000000 && val.cases > 100000 
                      ?
                      -70
                      :
                      val.cases < 100000 && val.cases > 10000
                      ?
                      -50
                      :
                      val.cases < 10000 && val.cases > 0
                      ?
                      -15
                      :
                      0
              }
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
                const newviewport = {
                  latitude: val.countryInfo.lat,
                  longitude: val.countryInfo.long,
                  zoom: 4.5,
                  width: '70vw',
                  height: '100vh',
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionDuration: 500
                }
                setViewPort(newviewport)
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
                  <div className='popup'>
                    <div className='popup-header'>
                      <h1>{selected.country}</h1>
                      <img src={selected.countryInfo.flag} alt='country flag' />
                    </div>
                    <div className='popup-body'>
                      <div className='pb-data'>
                        <h1>Confirmed Cases</h1>
                        <h2>{formatNumber(selected.cases)}</h2>
                      </div>
                      <div className='pb-data-deaths'>
                        <h1>Confirmed Deaths</h1>
                        <h2>{formatNumber(selected.deaths)}</h2>
                      </div>
                      <div className='pb-data-recovered'>
                        <h1>Confirmed Recovered</h1>
                        <h2>{formatNumber(selected.recovered)}</h2>
                      </div>

                    </div>
                  </div>
                  </Popup>
          ) 
         : 
         null
         }
       <div style={{position: 'absolute', right: 50, top: 50}}><NavigationControl showCompass={true} showZoom={true}/></div>
     </ReactMapGL>
    </div>
  );
}

export default App;
