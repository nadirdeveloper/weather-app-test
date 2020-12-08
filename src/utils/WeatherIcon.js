import moment from 'moment-timezone'

/**
 * @param {Object} data (weatherCurrent, Timeframe, day)
 */
const getWeatherIcon = data => {
  const { weather, dt:time, timezone } = data
  const icon = weather[0].main;
  const hour = moment(time * 1000)
    .tz(timezone)
    .format('H')
  const type = hour >= 6 && hour <= 18 ? 'day' : 'night'
  if (icon) {
    switch (icon) {
      case 'Clear':
        return type
      case 'Rain':
        return `${type}-rain`
      case 'Drizzle':
        return `${type}-rain`
      case 'Snow':
        return `${type}-snow`
      case 'Squall':
        return 'sleet'
      case 'Dust':
        return `${type}-cloudy`
      case 'Smoke':
        return `${type}-cloudy`
        case 'Sand':
          return `${type}-cloudy`
      case 'Fog':
        return `${type}-cloudy`
        case 'Ash':
          return `${type}-cloudy`
        case 'Mist':
          return `${type}-cloudy`
      case 'Clouds':
        return `${type}-cloudy`
      case 'Haze':
        return `${type}-cloudy`
      case 'Thunderstorm':
        return 'thunder'
      case 'Tornado':
        return 'wi-tornado'
      default:
        return 'wi-na'
    }
  }
  return 'wi-na'
}

export default getWeatherIcon
