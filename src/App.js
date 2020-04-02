import React, {useState, useEffect, useRef} from 'react';
import MapGL, {Source, Layer, Marker, NavigationControl, Popup, FlyToInterpolator} from 'react-map-gl'
import axios from 'axios'
import './App.css'
import Deck from './Deck.js'
import Map from './Components.js/Map'
import 'mapbox-gl/dist/mapbox-gl.css';


function App() {
  // Get the data for COVID19
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('https://corona.lmao.ninja/v2/jhucsse')
    .then(res => setData(res.data))
    .catch(err => err)
  }, [0])


  // Add commas to number
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return (
    <div className="App">
    <div className='nav-bar'>
      <h1>COVID_19</h1>
    </div>
      <div className='map-div'>
        <Map data={data ? data : null} formatNumber={formatNumber} />
      </div>
      
    </div>
  );
}

export default App;
