import React from 'react';
import DeckGL from '@deck.gl/react';
import axios from 'axios'
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {IconLayer} from '@deck.gl/layers'
import {StaticMap} from 'react-map-gl';

// Get the lighting right
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];


const ICON_MAPPING = {marker : {x: 0, y: 0, width: 30, height: 30}}

  class Deck extends React.Component {
    static get defaultColorRange(){
      return colorRange
    }
    constructor(){
        super()

        this.state = {
            COV_data: [],
            viewport: {
              longitude: -122.41669,
              latitude: 37.7853,
              zoom: 6,
              pitch: 40,
              minZoom: 4,
              maxZoom: 15,
              bearing: 0
            },
            the_layer: null
        }
    }

  componentDidMount = ( ) => {
      axios.get('https://corona.lmao.ninja/v2/jhucsse')
       .then(res => this.setState({COV_data: res.data}))
  }


  showMapData = () => {
    const cov_coords = this.state.COV_data.map(val => {
      const coords = [parseFloat(val.coordinates.longitude), parseFloat(val.coordinates.latitude)]
      const cov_data = { COORDINATES: coords, POINTS : val }
      return cov_data
    })
    return cov_coords
  }

  

  render(){
    const {COV_data} = this.state
    // const layer = [new HexagonLayer({
    //   id: 'hexagon-layer',
    //   colorRange,
    //   coverage: 1,
    //   data: COV_data ? this.showMapData() : null,
    //   elevationRange: [0, 10000],
    //   elevationScale: 50,
    //   extruded: true,
    //   radius: 20000,
    //   getPosition: d => d.COORDINATES,
    //   getElevationValue: point => parseInt(point[0].POINTS.stats.confirmed * 100),
    //   getColorValue: point => {
    //     const {Confirmed} = point[0].POINTS
    //     if(Confirmed > 10000){
    //       return 5
    //     } else if (Confirmed > 5000 && Confirmed < 10000){
    //       return 4
    //     } else if (Confirmed > 1000 && Confirmed < 5000){
    //       return 3
    //     } else if(Confirmed > 500 && Confirmed < 1000){
    //       return 2
    //     } else if (Confirmed > 100 && Confirmed < 500){
    //       return 1
    //     } else {
    //       return 0
    //     }
    //   },
    //   upperPercentile: 100,
    //   material
    // })]

    const layer = new IconLayer({
      id: 'icon-layer',
      data: COV_data ? this.showMapData() : null,
      iconMapping: ICON_MAPPING,
      getPosition: d => d.COORDINATES,
      getIcon: d => ({
        url: '../logi.png',
        height: 50,
        width: 50,
        id: 'icon'
      }),
    })

    console.log(layer.props)

        return (
          <div> 
            <DeckGL
                layers={layer.props.data.length > 0 ? layer : null}
                effects={[lightingEffect]}
                initialViewState={this.state.viewport}
                controller={true}
              >
              <StaticMap
                reuseMaps
                mapStyle={'mapbox://styles/mapbox/dark-v9'}
                preventStyleDiffing={true}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              />
            </DeckGL>
          </div>
               
          )
      }
  }

  export default Deck