import classes from './dailyforecast.module.css';


const DailyForecast = ({day, date, unit,avgtemp, mintemp, maxtemp, icon, text}) => {

    return (
        <div className={classes.dailyForecast}>
            <p className={classes.day}>{day}</p>
            <p><b>AVG: </b>{avgtemp}{unit}</p>
            <p><b>Low: </b>{mintemp}{unit}</p>
            <p><b>High: </b>{maxtemp}{unit}</p>
            <img className={classes.dailyForecastImg} src={icon} alt={`${date} forecast`} />
            <p className={classes.text}>{text}</p>
        </div>
    )
}

export default DailyForecast;