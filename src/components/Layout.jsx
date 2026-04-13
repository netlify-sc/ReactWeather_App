import classes from './layout.module.css';
import { useState } from 'react';
import DailyForecast from './DailyForecast';
import { useEffect } from 'react';



const Layout = () => {
    const [unit, setUnit] = useState("℉");

    const [data, setData] = useState([]);
    const [fail, setFail] = useState(null);
    
    const [input, setInput] = useState("");

    const [numDays, setNumDays] = useState(7);
    const [daysArray, setDaysArray] = useState([])

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

    const dateArray = (numberOfDays) => {
        const dates = new Array(numberOfDays);
        const DAYS = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        }
        let day = new Date().getDay();

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

    
    const fecthData = async (city, days) => {

        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=${days}&aqi=no&alerts=no`)
            const weather = await response.json();

            setDaysArray(dateArray(days))

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
        fecthData(input, numDays);
        setInput("");
    }

    const handleReset = (e) => {
        e.preventDefault();
        setLocation({});
        setForcast({})
        setFail(null);
        setData([]);
        setNumDays(7)
        setInput("");
    }

    const changeUnit = () => {
        (unit === "℃") ? setUnit("℉") : setUnit("℃");

    }

    const displayUnit = (unit === "℃") ? "℉" : "℃";

    return (
        <main className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.header}>

                <h1 className={classes.title}>Weather App</h1>
                <button className={classes.unitBtn} onClick={changeUnit}>{unit}</button>

            </div>
            <p>Enter city name to get the current weather and number of days between 1 - 14 to get daily forecast.</p>
            <form className={classes.weatherForm}>
                <input type="text" value={input} placeholder='Enter city name' onChange={(e) => setInput(e.target.value)} />
                <input type="number" name="numDays" placeholder='Number of days' min={1} max={14} value={numDays} onChange={(e) => setNumDays(Number(e.target.value))} />
                <button type='submit'>Get Weather Data</button>
                <button onClick={handleReset}>Reset</button>
            </form>
            {fail && <p className={classes.error}>{fail}</p>}

            <p>{location.name}</p>
            <p>{location.country}</p>
            {(data.length > 0) &&
                (
                    <div className={classes.current}>
                        <p>Current Temperature: {(unit === "℃") ? current.temp_f : current.temp_c}{displayUnit}</p>

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
                                date={daily.date}
                                day={daysArray[i]}
                                unit={displayUnit}
                                avgtemp={(unit === "℃") ? daily.day.avgtemp_f : daily.day.avgtemp_c}
                                mintemp={(unit === "℃") ? daily.day.mintemp_f : daily.day.mintemp_c}
                                maxtemp={(unit === "℃") ? daily.day.maxtemp_f : daily.day.maxtemp_c}
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