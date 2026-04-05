import classes from './layout.module.css';
import { useState } from 'react';


const Layout = () => {
    const [data, setData] = useState([]);
    const [fail, setFail] = useState(null);
    const [input, setInput] = useState("");

    const fecthData = async (city) => {

        try {
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=7&aqi=no&alerts=no`)
            const weather = await response.json();
            console.log(weather)

        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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
            


        </main>
    )
}

export default Layout;