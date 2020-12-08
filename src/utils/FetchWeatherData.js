import axios from 'axios'
import axiosRetry from 'axios-retry'
import {isUndefined, isEmpty, isNull} from 'lodash-es'
import FormatTime from './FormatTime'

const API_KEY = process.env.REACT_APP_DARKSKY_API_KEY
const CORS_URL = 'https://cors-anywhere.herokuapp.com'

// Exponential back-off retry delay between requests
axiosRetry(axios, {retryDelay: axiosRetry.exponentialDelay})

const getURL = latlong => {
  // return `${CORS_URL}/https://api.darksky.net/forecast/${API_KEY}/${latlong}?extend=hourly&exclude=minutely,flags`
  return `https://api.openweathermap.org/data/2.5/onecall?lat=49.1125&lon=9.7373&exclude=minutely,alerts&units=imperial&appid=15ae082efd5d59dfd372faa3e5c47758`
}

/**
 * @param {String} latlong (-43.53333,172.63333)
 */
const FetchWeatherData = async ({latlong}) => {
  let weatherCurrent = {}
  let weatherForecast = {}

  // fetch weather data only when latlong is valid to avoid uneccessary API calls
  if (!isUndefined(latlong) && !isEmpty(latlong) && !isNull(latlong)) {
    try {
      const {data} = await axios.get(getURL(latlong))
      console.log(data)
      const weatherData = data
      if (!isEmpty(weatherData) && !isUndefined(weatherData)) {
        // NOTE: add timezone property to current, days, and timeFrame data to use it later for
        // displaying weatherIcon with day or night variants specific to location timezone
        // parsing sunriseTime & sunsetTime according to the timezone
        const timezone = weatherData.timezone
        weatherCurrent = {
          timezone,
          ...weatherData.current,
          sunrise: weatherData.daily[0].sunrise,
          sunset: weatherData.daily[0].sunset
        }

        // group 168 hours into days as keys in timeFrames
        // group days and timeFrames into weatherForecast
        const timeFrames = {}
        // create date as the keys for timeFrame in timeFrames
        // i.e timeFrames: {'02/28/2020': [{...timeFrame},...], ...}
        weatherData.hourly.forEach(hour => {
          const date = FormatTime(hour.dt, timezone, 'MM/DD/YYYY')
          if (Object.keys(timeFrames).includes(date)) {
            timeFrames[date].push({timezone, ...hour})
          } else {
            timeFrames[date] = [{timezone, ...hour}]
          }
        })
        const days = {}
        // create date as the keys for the day in days
        // i.e days: {'02/28/2020': {...day}, ...}
        weatherData.daily.forEach(day => {
          const date = FormatTime(day.dt, timezone, 'MM/DD/YYYY')
          // since there will be unique day objects in days
          // just create a 'date' key with day object as value for as many days
          days[date] = {timezone, ...day}
        })

        weatherForecast = {timeFrames, days}
      }
    } catch (err) {
      console.error(err)
    }
  }
// console.log({
//   weatherCurrent,
//   weatherForecast
// })
  return {
    weatherCurrent,
    weatherForecast
  }
}

export default FetchWeatherData
