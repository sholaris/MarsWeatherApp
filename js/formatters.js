function formatDate(date){
    return date.toLocaleDateString('en-GB', {month: 'long', day:'numeric'})
}
  
function formatTemperature(temperature){
    let returnTemp = temperature
    if(!isMetric()){
      returnTemp = (temperature-32)*(5/9)
    }
    return Math.round(returnTemp)
}
  
function formatSpeed(speed){
    let returnSpeed = speed
    if(!isMetric()){
      returnSpeed = speed / 1.609
    }
    return Math.round(returnSpeed)
}

export {formatDate, formatSpeed, formatTemperature}