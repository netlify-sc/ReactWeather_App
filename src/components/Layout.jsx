import classes from './layout.module.css';
import { useState } from 'react';


const Layout = () => {
    const [data, setData] = useState([]);
    const [fail, setFail] = useState(null);
    const [input, setInput] = useState("");

    const [current, setCurrent] = useState({});
    const [location, setLocation] = useState({
        name: "",
        country: ""
    })

    const fecthData = async (city) => {

        try {
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=7&aqi=no&alerts=no`)
            const weather = await response.json();

            if (response.status !== 200) {
                setFail("Something went wrong, please try again.")
            }

            if (response.status === 200) {

                setLocation(weather.location)
            }
            console.log(weather)

        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocation({})
        setFail("")
        fecthData(input);
        setInput("")


    }

    return (
        <main className={classes.container} onSubmit={handleSubmit}>
            <h1>Weather App</h1>
            <form>
                <p>Enter city name</p>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
                <button type='submit'>Get Weather Data</button>
            </form>
            <p>{fail}</p>

            <p>{location.name}</p>
            <p>{location.country}</p>



        </main>
    )
}

export default Layout;