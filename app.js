'use strict'
const ApiKey = '297eb650de708ced82cbf882b09ac7ff'
let today = new Date()
let currentHour = today.getHours()
let currentMinute = today.getMinutes()
let currentTime = currentMinute < 10 ? `${currentHour}:0${currentMinute}` : `${currentHour}:${currentMinute}`
let numberDay = new Date().getDay() - 1;

let ulSalatName = document.getElementById('salat-name')
let ulSalatHours = document.getElementById('salat-hour')
const actualCity = document.querySelector('.actual-city')
const nextSalatName = document.getElementById('next-salat-name')
const nextSalatHour = document.getElementById('next-salat-hour')
const rebour = document.getElementById('rebour')
const loader = document.querySelector('.loader')


// console.log(currentTime)

function localisation(position){
    loader.classList.toggle('hidden')
    let pos = position.coords
    let latitude = pos.latitude
    let longitude = pos.longitude
    console.log(pos)

    let urlAPIcity = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${ApiKey}&units=metric&lang=fr`
    fetch(urlAPIcity).then((response)=>{
        response.json().then((city)=> {
            // console.log(city)
            actualCity.textContent = city.name;      
        });
    })
    
    let urlAPI = `https://api.pray.zone/v2/times/this_week.json?longitude=${longitude}&latitude=${latitude}&elevation=333&schoo=11`
    fetch(urlAPI).then((response)=>{
        response.json().then((salats)=> {
            let weekSalat = [...salats.results.datetime]
            let todaySalat = weekSalat[numberDay]
            console.log(todaySalat.times)
            for (const [salatName, salatHour] of Object.entries(todaySalat.times)) {
                // console.log(salatName, salatHour)
                let liNames = document.createElement('li')
                liNames.innerHTML = salatName === 'Sunrise' ? `Levé du soleil` : salatName === 'Sunset' ? `Couché du soleil` : salatName === 'Midnight' ? `Milieu de la nuit` : `${salatName}` 
                ulSalatName.append(liNames)

                let liHours = document.createElement('li')
                liHours.innerHTML = `${salatHour}`
                ulSalatHours.append(liHours)
            }

            for (const [salatName, salatHour] of Object.entries(todaySalat.times)) {

                let [hour1, hour2 , , min1, min2] = [...salatHour]
                let hourSalats = Number(hour1+hour2)
                let minSalats = Number(min1+min2)

                let [hour3, hour4 , , min3, min4] = [...currentTime]
                let hourCurrent = Number(hour3+hour4)
                let minCurrent = Number(min3+min4)
                // console.log(hourCurrent, minCurrent, hourSalats, minSalats)

                if(hourCurrent <= hourSalats && salatName !=='Sunset' && salatName !== 'Sunrise' && salatName !== 'Midnight'){
                    console.log('PROCHAINE SALAT:', salatName)
                    let minNext = minSalats - minCurrent
                    let hourNext = hourSalats - hourCurrent
                    if(minNext<0){
                        minNext = 60 + minNext
                        hourNext = hourNext - 1
                    }
                    let timNext = `${hourNext}h ${minNext}min`
                    rebour.textContent = timNext
                    
                    nextSalatName.textContent= salatName
                    nextSalatHour.textContent= salatHour
                    break
                }
            }
          });
    })
}

navigator.geolocation.getCurrentPosition(localisation)