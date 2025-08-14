import React from "react";
import windIcon from "../assets/wind.png";
import humidityIcon from "../assets/humidity.png";
import visibilityIcon from "../assets/visibility.png";
import sunriseIcon from "../assets/sunrise.png";
import sunsetIcon from "../assets/sunset.png";

const Icon =({alt,src, className}) =>(
    <img alt={alt} src={src} className={`h-8 w-8 inline-block ${className}`}/>
)

export const WindIcon =()=> <Icon alt='Wind' src={windIcon} className="animate-icon svg-hover"/>
export const HumidityIcon =()=> <Icon alt='Humdity' src={humidityIcon} className="powerful-pulse svg-hover"/>
export const VisibilityIcon =()=> <Icon alt='Visibility' src={visibilityIcon} className="powerful-pulse svg-hover"/>
export const SunriseIcon =()=> <Icon alt='Sunrise' src={sunriseIcon} className="powerful-pulse svg-hover"/>
export const SunsetIcon =()=> <Icon alt='Sunset' src={sunsetIcon} className="powerful-pulse svg-hover"/>
