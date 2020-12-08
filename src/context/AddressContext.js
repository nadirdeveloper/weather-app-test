import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import axios from 'axios'
import {isEmpty, isUndefined} from 'lodash-es'
import HEADERS from '../utils/AlgoliaHeaders'
import validName from './../utils/ValidCityName'

// const token = process.env.REACT_APP_IPINFO_TOKEN
const AddressContext = React.createContext(null)

class AddressContextProvider extends Component {
  updateState = (state) => {
    this.setState({...state})
  }

  updateFavorites = (state) => {
    this.setState({...state})
  }
  state = {
    address: {
      cityName: '',
      cityId: '',
    },
    latlong: '',
    favorites: [],
    updateState: this.updateState,
    updateFavorites: this.updateFavorites,
  }

  formatCoords = (latitude, longitude) => {
    return `${latitude},${longitude}`
  }

  updateAddress = async (latlong) => {
    let hit = {}
    try {
      const {hits} = (
        await axios.get(
          `https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${latlong},&hitsPerPage=1&language=en`,
          {
            headers: HEADERS,
          }
        )
      ).data
      hit = hits[0]

      if (!isEmpty(hit) && !isUndefined(hit)) {
        const city = hit.city ? hit.city[0] : ''
        const state = hit.administrative ? hit.administrative[0] : ''
        const country = hit.country ? hit.country : ''
        const cityName = `${validName(city)}${validName(state)}${validName(
          country,
          false
        )}`
        const cityId = hit.objectID ? hit.objectID : ''
        this.updateState({
          address: {
            cityName,
            cityId,
          },
          latlong,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  getAddress = async () => {
    // if ('geolocation' in navigator) {
    //   navigator.geolocation.getCurrentPosition(async (position) => {
    //     const latlong = this.formatCoords(
    //       "24.8607", "67.0011"
    //     )
    //     this.updateAddress(latlong)
    //   })
    // } else {
      
    // }

    try {
      const {data} = await axios.get('https://ipapi.co/json')
      const latlong = this.formatCoords("49.1125", "9.7373")
      this.updateAddress(latlong)
    } catch (error) {
      console.log(error)
    }
  }

  getFavorites = () => {
    if (localStorage.getItem('favorites')) {
      this.setState({
        favorites: [...JSON.parse(localStorage.getItem('favorites'))],
      })
    }
  }

  componentDidMount() {
    this.getAddress()
    // update favorites for the initial application load
    this.getFavorites()
  }

  render() {
    return (
      <AddressContext.Provider value={this.state}>
        {this.props.children}
      </AddressContext.Provider>
    )
  }
}

export {AddressContext, AddressContextProvider}

AddressContext.propTypes = {
  address: PropTypes.objectOf(PropTypes.string),
  favorites: PropTypes.array,
  updateState: PropTypes.func,
  updateFavorites: PropTypes.func,
}
