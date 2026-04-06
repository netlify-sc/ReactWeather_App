import classes from './layout.module.css';
import { useState } from 'react';


const Layout = () => {
    const [data, setData] = useState([]);
    const [fail, setFail] = useState(null);
    const [input, setInput] = useState("");

    const [current, setCurrent] = useState({
        temp_c: "",
        temp_f: "",
        condition: {
            icon: ""
        }
    });
    const [location, setLocation] = useState({
        name: "",
        country: ""
    })

    const [forecast, setForcast] = useState({
        forecastday: [{}]
    })

    const fecthData = async (city) => {

        try {
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=7&aqi=no&alerts=no`)
            const weather = await response.json();

            if (response.status !== 200) {
                setFail("Something went wrong, please try again or enter different city name.")
            }

            if (response.status === 200) {
                setData([weather])
                setLocation(weather.location);
                setCurrent(weather.current);
            }
            console.log(weather)

        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocation({});
        setFail(null);
        setData([]);
        fecthData(input);
        setInput("");
    }

    const handleReset = (e) =>{
        e.preventDefault();
        setLocation({});
        setFail(null);
        setData([]);
        setInput("");
    }

    return (
        <main className={classes.container} onSubmit={handleSubmit}>
            <h1 className={classes.title}>Weather App</h1>
            <form>
                <p>Enter city name</p>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
                <button type='submit'>Get Weather Data</button>
                <button onClick={handleReset}>Reset</button>
            </form>
            {fail && <p className={classes.error}>{fail}</p>}

            <p>{location.name}</p>
            <p>{location.country}</p>
            {(data.length > 0) &&
                (
                    <div className={classes.current}>
                        <p>{current.temp_c}C / {current.temp_f}F</p>
                        <img src={current.condition.icon} alt="Current Weather" />
                    </div>)
            }



        </main>
    )
}

export default Layout;