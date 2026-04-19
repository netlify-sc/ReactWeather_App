import classes from './layout.module.css';
import { Fragment, useState } from 'react';
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
        temp_C: "",
        temp_F: "",
        weatherIconUrl: [
            {
                value: ""
            }
        ],
        weatherDesc: [
            {
                value: ""
            }
        ]
    });

    const [location, setLocation] = useState({
        name: "",
        country: ""
    })

    const [forecast, setForcast] = useState(
        [{
            date: "",
            maxtempC: "",
            maxtempF: "",
            mintempC: "",
            mintempF: "",
            avgtempC: "",
            avgtempF: "",
            hourly: [
                {
                    weatherIconUrl: [{
                        value: ""
                    }],
                    weatherDesc: [{
                        value: ""
                    }]
                }
            ]
               
        }]
    )

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
            // const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&days=${days}&aqi=no&alerts=no`)
            const response = await fetch(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${import.meta.env.VITE_WEATHER_API}&q=${city}&num_of_days=${days}&format=json`)
            const weather = await response.json();

            setDaysArray(dateArray(days))

            if (response.status !== 200) {
                setFail("Something went wrong, please try again or enter different city name.")
            }

            if (response.status === 200) {
                setData([weather])
                setLocation({
                    name: weather.data.request[0].query.split(", ")[0],
                    country: weather.data.request[0].query.split(", ")[1]
                });
                setCurrent(weather.data.current_condition[0]);
                setForcast(weather.data.weather.map(day=>{
                    const randomPeriod = Math.floor(Math.random() * day.hourly.length);
                    // const randomPeriod =  day.hourly.length;
                    return {
                        ...day, 
                        randomPeriod: randomPeriod
                    }

                }));
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

    const times = {
        "0": "12 AM",
        "300": "3 AM",
        "600": "6 AM",
        "900": "9 AM",
        "1200": "12 PM",
        "1500": "3 PM",
        "1800": "6 PM",
        "2100": "9 PM",


    }

    return (
        <main className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.header}>

                <h1 className={classes.title}>Weather App</h1>
                <button className={classes.unitBtn} onClick={changeUnit} title='Change Unit'>{unit}</button>

            </div>
            <p className={classes.description}>Enter city name for the current weather and number of days between 1 - 14 for daily forecast. Change units at the top right.</p>
            <form className={classes.weatherForm}>
                <div>
                    <input type="text" value={input} placeholder='Enter city name' onChange={(e) => setInput(e.target.value)} required/>
                    <input className={classes.numInput} type="number" name="numDays" placeholder='Number of days' min={1} max={14} value={numDays} onChange={(e) => setNumDays(Number(e.target.value))} />
                </div>
                <div>
                    <button type='submit'>Get Weather Data</button>
                    <button className={classes.reset} onClick={handleReset}>Reset</button>
                </div>
            </form>
            {fail && <p className={classes.error}>{fail}</p>}

            {(data.length > 0) &&
                (
                    <div className={classes.current}>
                        <p className={classes.city}>{location.name}</p>
                        <p>{location.country}</p>
                        <p className={classes.currentTemp}>Current Temperature: {(unit === "℃") ? current.temp_F : current.temp_C}{displayUnit}</p>

                        <img src={current.weatherIconUrl[0].value} alt="Current Weather" />
                        <p>{current.weatherDesc[0].value}</p>
                    </div>)
            }
            {(data.length > 0) &&
                <>
                    {/* <p className={classes.description}>Daily forecast for the next {forecast.forecastday.length} days.</p> */}
                    <div className={classes.forecast}>

                         {forecast.map((daily, i) => {
                            
                            return (
                                <DailyForecast
                                    key={daily.date}
                                    date={daily.date}
                                    day={daysArray[i]}
                                    unit={displayUnit}
                                    avgtemp={(unit === "℃") ? daily.avgtempF : daily.avgtempC}
                                    mintemp={(unit === "℃") ? daily.mintempF : daily.mintempC}
                                    maxtemp={(unit === "℃") ? daily.maxtempF : daily.maxtempC}
                                    icon={daily.hourly[daily.randomPeriod].weatherIconUrl[0].value}
                                    period={times[daily.hourly[daily.randomPeriod].time]}
                                    text={daily.hourly[daily.randomPeriod].weatherDesc[0].value}
                                />
                            )
                        })
                        } 

                    </div>
                </>
            }
        </main>
    )
}

export default Layout;