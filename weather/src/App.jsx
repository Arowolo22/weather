
import WeatherBackground from './components/WeatherBackground';
import React,{ useState useEffect} from 'react';
import {WindIcon,HumidityIcon ,VisibilityIcon, SunriseIcon,SunsetIcon} from "../assets/wind.png";
import {convertTemperature, getHumidityValue, getVisibilityValue, getWindDirection} from "./components/Helper"



const App = () => {

  const [weather, setWeather] = useState(null);
  const [city , setCity] = useState('');
  const [suggestions, setSuggestions]= useState([]);
  const [unit , setUnit]= useState('c');
  const [error, seterror]= useState('')

  const API_KEY ='22803c376cf17fa0b25d5bfa4479761f'


  useEffect(()=>{
    if(city.trim().length>=0 && !weather){
      const timer =setTimeout(()=> fetchSuggestion(city),500)
      return ()=>clearTimeout(timer)
    }
    setSuggestions([])
  },[city,weather])

  //http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}

  const fetchSuggestion = async (query) =>{
    try{
      const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
      res.ok? setSuggestions(await res.json()): setSuggestions([])

    }catch{
      setSuggestions([])
      console.error('Error while fetching suggestions')

    }
  }


  return (
    <div>App</div>
  )
}

export default App