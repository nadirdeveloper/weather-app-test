import React, {useContext, Fragment} from 'react'
import {ThemeContext} from '../../context/ThemeContext'
import getWeatherBackground from './../../utils/WeatherBackground'
import CurrentWeatherContainer from './../current-weather/CurrentWeatherContainer'
import ForecastContainer from './../forecast/ForecastContainer'
import './WeatherForecastStyle.scss'
import AssetsSrcURL from '../../utils/AssetsSrcURL'

const WeatherForecastContainer = ({
  weatherCurrent,
  weatherForecast,
  address,
  latlong,
}) => {
 
  const {theme, colorTheme} = useContext(ThemeContext)

  const WET_TYPES = ['Rain', 'Snow', 'sleet', 'hail']

  // return rain or snow svg image for the above wet types
  const weatherSVG = () => {
    if (weatherCurrent.weather[0].main === 'Snow') {
      return 'snow'
    }
    return 'rain'
  }

  const imageBorder = {
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
  }

  return (
    <Fragment>
      <div
        className={'flex flex-col justify-center items-center'}>
        <div
          className={`sm:w-full lg:w-6/6 xl:max-w-100 bg-${theme} text-${colorTheme} border border-${colorTheme} md:border-none shadow-lg`}>
          <div className='relative overflow-hidden'>
            <img
              src={`${AssetsSrcURL}/weather-backgrounds/${getWeatherBackground(
                weatherCurrent
              )}.jpg`}
              alt='clear day'
              className='w-full object-cover object-center weather-background'
              style={imageBorder}
            />
            {/* show rain or snow svg only when weather icon exist in WET_TYPES*/}
            <div>
              {WET_TYPES.includes(weatherCurrent.weather[0].main) && (
                <img
                  src={`${AssetsSrcURL}/weather-backgrounds/${weatherSVG()}.svg`}
                  alt='clear day'
                  className='w-full object-cover object-center absolute top-0 right-0 bottom-0 left-0 weather-background'
                  style={imageBorder}
                />
              )}
            </div>

            {/* current weather container should be on the image on mobile and small devices */}
            <div
              className='block md:hidden absolute top-0 bottom-0 left-0 right-0 my-auto mx-auto text-light'
              style={{background: 'rgba(0,0,0,0.2)', ...imageBorder}}>
              <CurrentWeatherContainer
                weatherCurrent={weatherCurrent}
                address={address}
                latlong={latlong}
              />
            </div>

            {/* current weather and forecast container should be on the image from medium devices */}
            <div
              className='hidden md:block absolute top-0 bottom-0 left-0 right-0 my-auto mx-auto text-light'
              style={{background: 'rgba(0,0,0,0.2)', ...imageBorder}}>
              <CurrentWeatherContainer
                weatherCurrent={weatherCurrent}
                address={address}
                latlong={latlong}
              />
              <ForecastContainer
                cityName={address.cityName}
                weatherCurrent={weatherCurrent}
                weatherForecast={weatherForecast}
              />
            </div>
          </div>

          <div className='block md:hidden'>
            <ForecastContainer
              cityName={address.cityName}
              weatherCurrent={weatherCurrent}
              weatherForecast={weatherForecast}
            />
          </div>
        </div>
      </div>

      {/* <div className='relative'>
        <p
          className={`mx-auto text-center pt-2 pb-10 text-xs font-light text-${colorTheme} bg-${theme}`}>
          Powered by&nbsp;
          <a
            href='https://darksky.net/poweredby/'
            target='_blank'
            rel='noreferrer noopener'
            className={`link z-0 font-medium hover:text-${theme}`}>
            Dark Sky
          </a>
        </p>
      </div> */}
    </Fragment>
  )
}

export default WeatherForecastContainer
