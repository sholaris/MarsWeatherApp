const API_KEY = 'DEMO_KEY'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`


const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector(".previous-weather");

// ELEMENTS DISPLAYING CURRENT WEATHER
const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentTempHighElement = document.querySelector('[data-current-temp-high]')
const currentTempLowElement = document.querySelector('[data-current-temp-low]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionText = document.querySelector('[data-wind-direction-text]')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]')

// ELEMENTS DISPLAYING PREVIOUS DAYS WEATHER
const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')

// UNITS ELEMENTS
const unitToggle = document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const imperialRadio = document.getElementById('fah')

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

let selectedSolIndex;

const getWeather = () => {
  return fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const {
      sol_keys,
      validity_checks,
      ...solData
    } = data
    return Object.entries(solData).map(([sol, data]) => {
      return {
        sol,
        maxTemp: data.AT !== undefined ? data.AT.mx : data.PRE.mx,
        minTemp: data.AT !== undefined ? data.AT.mn : data.PRE.mn,
        windSpeed: data.HWS !== undefined ? data.HWS.av : 0,
        windDirectionDegrees: data.WD.most_common !== null ? data.WD.most_common.compass_degrees : 0,
        windDirectionCardinal: data.WD.most_common !== null ? data.WD.most_common.compass_point : 'not specified',
        date: new Date(data.First_UTC)
      }
    })
  })
}

getWeather().then(sols => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits()

  unitToggle.addEventListener('click', () => {
    let metricUnits = !isMetric()
    metricRadio.checked = metricUnits
    imperialRadio.checked = !metricUnits
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits()
  })

  metricRadio.addEventListener('change', () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits()
  })
  
  imperialRadio.addEventListener('change', () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits()
  })

})

const displaySelectedSol = sols => {
  const selectedSol = sols[selectedSolIndex]
  currentSolElement.innerText = selectedSol.sol
  currentDateElement.innerText = formatDate(selectedSol.date),
  currentTempHighElement.innerText = formatTemperature(selectedSol.maxTemp),
  currentTempLowElement.innerText = formatTemperature(selectedSol.minTemp),
  windSpeedElement.innerText = formatSpeed(selectedSol.windSpeed),
  windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)
  windDirectionText.innerText = selectedSol.windDirectionCardinal
}

const displayPreviousSols = sols => {
  previousSolContainer.innerHTML = '';
  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true)
    solContainer.querySelector('[data-sol]').innerText = solData.sol
    solContainer.querySelector('[data-date]').innerText = formatDate(solData.date)
    solContainer.querySelector('[data-temp-high]').innerText = formatTemperature(solData.maxTemp)
    solContainer.querySelector('[data-temp-low]').innerText = formatTemperature(solData.minTemp)
    solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
      selectedSolIndex = index
      displaySelectedSol(sols)
    })
    previousSolContainer.appendChild(solContainer);
  })
}

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


function isMetric(){
  return metricRadio.checked
}

function updateUnits(){
  const speedUnits = document.querySelectorAll('[data-speed-unit]')
  const tempUnits = document.querySelectorAll('[data-temp-unit]')
  speedUnits.forEach(unit => {
    unit.innerText = isMetric() ? 'kph' : 'mph'
  })
  tempUnits.forEach(unit => {
    unit.innerText = isMetric() ? 'C' : 'F'
  })
}

