import classes from "./currentweather.module.css";

const CurrentWeather = ({city, country, currentTemp, icon, description, displayUnit}) => {
    return (
        <>
            <div className={classes.current}>
                <p className={classes.city}>{city}</p>
                <p>{country}</p>
                <p className={classes.currentTemp}>Current Temperature: {currentTemp}{displayUnit}</p>

                <img src={icon} alt="Current Weather" />
                <p>{description}</p>
            </div>

        </>
    )
}

export default CurrentWeather;