import classes from './layout.module.css';
import { useState } from 'react';
import DailyForecast from './DailyForecast';

const DAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}


const Layout = () => {
    const [data, setData] = useState([]);
    const [fail, setFail] = useState(null);
    const [input, setInput] = useState("");

    const [current, setCurrent] = useState({
        temp_c: "",
        temp_f: "",
        condition: {
            icon: "",
            text: ""
        }
    });
    const [location, setLocation] = useState({
        name: "",
        country: ""
    })

    const dateArray = () => {
        const dates = new Array(7);
        let day = new Date().getDay();
        dates[0] = day;

        for (let i = 0; i < dates.length; i++) {
            if (day > 6) {
                day = 0;
            }
            dates[i] = DAYS[day];
            day++;
        }
        dates[0] = "Today";
        return dates;
    }

    const [forecast, setForcast] = useState({
        forecastday: [{
            date: "",
            day: {
                maxtemp_c: "",
                maxtemp_f: "",
                mintemp_c: "",
                mintemp_f: "",
                avgtemp_c: "",
                avgtemp_f: "",
                condition: {
                    text: "",
                    icon: "",
                    code: ""
                }
            }
        }]
    })

    const dates = dateArray();


    const fecthData = async (city) => {

        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=7&aqi=no&alerts=no`)
            const weather = await response.json();

            if (response.status !== 200) {
                setFail("Something went wrong, please try again or enter different city name.")
            }

            if (response.status === 200) {
                setData([weather])
                setLocation(weather.location);
                setCurrent(weather.current);
                setForcast(weather.forecast);
            }
            

        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocation({});
        setFail(null);
        setData([]);
        setForcast({})
        fecthData(input);
        setInput("");
    }

    const handleReset = (e) => {
        e.preventDefault();
        setLocation({});
        setForcast({})
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
                        <p>{current.temp_c}℃ / {current.temp_f}℉</p>
                        <img src={current.condition.icon} alt="Current Weather" />
                        <p>{current.condition.text}</p>
                    </div>)
            }
            <div className={classes.forecast}>
                {
                    (data.length > 0) && forecast.forecastday.map((daily, i) => {
                        return (

                            <DailyForecast
                                key={daily.date}
                                day={dates[i]}
                                avgtemp_c={daily.day.avgtemp_c}
                                avgtemp_f={daily.day.avgtemp_f}
                                mintemp_c={daily.day.mintemp_c}
                                mintemp_f={daily.day.mintemp_f}
                                maxtemp_c={daily.day.maxtemp_c}
                                maxtemp_f={daily.day.maxtemp_c}
                                icon={daily.day.condition.icon}
                                text={daily.day.condition.text}
                            />


                        )
                    })
                }

            </div>



        </main>
    )
}

export default Layout;