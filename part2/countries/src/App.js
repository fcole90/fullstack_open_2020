import React, { useState, useEffect } from 'react'
import axios from 'axios'


const FindCountries = ({updateSearch, searchCountry}) => (
  <>
    <p>Find countries</p>
    <input onChange={updateSearch}  value={searchCountry} />
  </>
)


const CapitalWeatherDetail = ({weatherData}) => {
  console.log("CapitalWeatherDetail:", weatherData)
  return weatherData === undefined ? (<></>) :
  <>
    <p>temperature: {weatherData.temperature}° Celsius</p>
    <img alt={weatherData.weather_descriptions[0]} src={weatherData.weather_icons[0]} />
    <p>wind: {weatherData.wind_speed} Km/h - direction: {weatherData.wind_dir} </p>
    
  </>
}


const CountryDetails = ({country, weather}) => {
return (
  <>
    <h2>{country.name}</h2>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h3>Spoken languages</h3>
    <ul>
    {country.languages.map(language => (
      <li key={language.iso639_1}>{language.name}</li>
    ))}
    </ul>
    {console.log(country.flag)}
    <img style={{maxWidth: 12 + "em", border: "1px solid gray"}} src={country.flag} alt={`Flag of ${country.name}`}/>
    <CapitalWeatherDetail weatherData={weather?.data?.current} />
  </>
)}


const CountryListElement = ({country, showHandler}) => (
  <div>
    <p>{country.name}</p>
    <button onClick={showHandler}>Show</button>
  </div>
)


function App() {
  const [searchCountry, setSearchCountry] = useState("")
  const [countries, setCountries] = useState([])
  const [weatherDict, setWeatherDict] = useState({})
  const apiKeyWeather = process.env.REACT_APP_API_KEY_WEATHERSTACK

  // console.log("API_KEY:", apiKeyWeather)

  const updateSearch = (event) => {
    console.log("Update:", event.target.value);
    setSearchCountry(event.target.value)
  }


  const getCountries = () => {
    if (searchCountry.length > 0) {
      axios
      .get(`https://restcountries.eu/rest/v2/name/${searchCountry}`)
      .then(response => {
        const data = response.data
        // If only one is available, it's expanded
        if (data.length === 1) {
          setCountries([{
            __custom: {IsExpanded: true},
            ...data[0],
          }])
        }
        else {
          setCountries(data)
        }
       
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setCountries([])
        }
        else throw err
      })
    }
    console.log("------------------")
  }


  const getWeather = () => {
    countries.forEach((country) => {
      if (country.__custom?.IsExpanded) {
        const countryCapital = country.capital
        const apiResource = `http://api.weatherstack.com/current?access_key=${apiKeyWeather}&query=${countryCapital}&units=m`
        console.log(`${country.name} is expanded!`)
        // console.log(apiResource)

        if (!weatherDict[countryCapital]?.success === true) {
          console.log(`Retrieving weather for '${countryCapital}'...`);
          axios
            .get(apiResource)
            .then(response => {
              setWeatherDict({
                [countryCapital]: {
                  success: true,
                  updateTime: Date.now(),
                  data: response.data
                },
                ...weatherDict
              })
            })
            .catch(err => {
              setWeatherDict({
                [countryCapital]: {
                  success: false,
                  updateTime: Date.now(),
                  error: err
                },
                ...weatherDict
              })
    
              if (err.response?.code) {
                console.log(err.response)
                console.log("Weather API error")
              }
              if (err.response?.status === 404) {
                console.log("No weather match for", countryCapital)
              }
              else throw err
            })
        } else {
          console.log(`${countryCapital}'s weather is already available.`)
        }
        console.log(weatherDict)
        console.log("------------------")

      }
    })
    
    // debugger
  }


  const setExpandedCountryFactory = (countryName) => (
    event => {
      const countriesCopy = countries
        .map(country => (
          country.name === countryName
          ? {
              __custom: {IsExpanded: true},
              ...country,
            }
          : country  
          )
        )
      setCountries(countriesCopy)
      }
  )
  

  useEffect(getCountries, [searchCountry])
  useEffect(getWeather, [weatherDict, apiKeyWeather, countries])

  return (
    <>
      <FindCountries updateSearch={updateSearch}  searchCountry={searchCountry} />
      {
        searchCountry.length === 0
        ? <p>Please, type the name of a country</p>
        : countries.length === 0
        ? <p>No country found with <em>{searchCountry}</em></p>
        : countries.length === 1 
        ? <CountryDetails country={countries[0]} weather={weatherDict[countries[0]?.capital]}/>
        : countries.length <= 10
        ? countries.map((country) => (
            country.__custom?.IsExpanded === true
            ? <CountryDetails key={country.name} country={country} weather={weatherDict[country.capital]}/>
            : <CountryListElement  key={country.name} country={country} showHandler={setExpandedCountryFactory(country.name)}/>
          )
        )
        : <p>Too many matches! Please, be more specific.</p>
      }
    </>
  );
}

export default App;
