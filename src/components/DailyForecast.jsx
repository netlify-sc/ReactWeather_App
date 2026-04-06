import classes from './dailyforecast.module.css';


const DailyForecast = ({day ,avgtemp_c, avgtemp_f, mintemp_c, mintemp_f, maxtemp_c, maxtemp_f, icon, text}) => {
    return (
        <div className={classes.dailyForecast}>
            <p>{day}</p>
            <p><b>AVG: </b>{avgtemp_c}℃ / {avgtemp_f}℉</p>
            <p><b>Low: </b>{mintemp_c}℃ / {mintemp_f}℉</p>
            <p><b>High: </b>{maxtemp_c}℃ / {maxtemp_f}℉</p>
            <img className={classes.dailyForecastImg} src={icon} alt={`${day} forecast`} />
            <p>{text}</p>
        </div>
    )
}

export default DailyForecast;