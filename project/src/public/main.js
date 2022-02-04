import "./assets/stylesheets/index.css"

import Immutable from 'immutable'

let store = Immutable.Map({
    user:   { name: "Student" } ,
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    chosenRover: 'Curiosity'
})

const getImageOfTheDay = (state) => {
    let chosenRover = state.get('chosenRover')
    console.log(chosenRover)
    fetch(`http://localhost:3000/apod/${chosenRover}`)
        .then(res => res.json())
        .then(apod => {
            apod.chosenRover = chosenRover;
            updateStore(store, { apod })
        })
}

// add our markup to the page
const root = document.getElementById('root')

// High Order Function
const createUpdateStore = (renderFn) => {
    const updateStore = (store, newState) => {
        store = store.mergeDeep(newState)
        renderFn(store)
    }
    return updateStore
}

const updateStore = createUpdateStore( (store) => render(root, store))

const render = async (root, state) => {
    root.innerHTML = App(state)

    let curiosityButton = document.getElementById('nav-item1')
    if(curiosityButton) {
    curiosityButton.addEventListener('click', function changeRover(){
        updateStore(store, {
            chosenRover : 'Curiosity'
        })
    })
    }  

    let opportunityButton = document.getElementById('nav-item2')
    if(opportunityButton){
    opportunityButton.addEventListener('click', function changeRover(){
        updateStore(store, {
            chosenRover: 'Opportunity'
        })
    })
    }

    let spiritButton = document.getElementById('nav-item3')
    if(spiritButton){
    spiritButton.addEventListener('click', function changeRover(){
        updateStore(store, {
            chosenRover: 'Spirit'
        })
    })
    }
}

// create content
const App = (state) => {
    const rovers = state.get('rovers')
    const apod = state.get('apod')

    return `
    <header></header>
    <main>
        <strong id='mainMessage'>Welcome Student!!</strong>
        <section>
            <ul class='navbar_menu' id='navbar_list'>
                <li class='nav-item' id='nav-item1'>Curiosity</li>
                <li class='nav-item' id='nav-item2'>Opportunity</li>
                <li class='nav-item' id='nav-item3'>Spirit</li>
            </ul>
            <strong>${roversName(state)}</strong>
            <p>
                ${roversText(state)}
            </p>
            <div class='wrapper'>
                <div id='info'> ${roversData(apod)}
                </div>
                <div id='photo'>${ImageOfTheDay(apod, state)}</div>
            </div>
        </section>
    </main>
    <footer></footer>
    `
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod, store) => {

    // If image does not already exist, or it is not from today -- request it again
    if (!apod || apod.chosenRover !== store.get('chosenRover') ) {
        console.log('hey', store)
        getImageOfTheDay(store)
    } else {
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.images.photos[0].img_src}" height="350px" width="50%" />
            <div id='photoDate'>Photo's Date: ${apod.images.photos[0].earth_date}</div>
        `)
    }
}}

const roversData = (apod) => {
    if(apod){
        return (`<div class='roverInfo' id='roverName'>Rover's name: ${apod.images.photos[0].rover.name}.</div>
                <div class='roverInfo' id='launchDate'>Launch Date: ${apod.images.photos[0].rover.launch_date}.</div>
                <div class='roverInfo' id='landingDate'>Landing Date: ${apod.images.photos[0].rover.landing_date}.</div>
                <div class='roverInfo' id='roverStatus'>Status: ${apod.images.photos[0].rover.status}.</div>`)
    }
}

const roversName = (store) => {
    if(store.get('chosenRover') == 'Curiosity'){
        return `Curiosity Rover.`
    } else if (store.get('chosenRover') == 'Opportunity') {
        return `Opportunity Rover.`
    } else if (store.get('chosenRover') == 'Spirit'){
        return `Spirit Rover.`
    }
}

const roversText = (store) => {
    const chosenRover = store.get('chosenRover')
    if(chosenRover == 'Curiosity'){
        return `Part of NASA's Mars Science Laboratory mission, Curiosity is the largest and most capable rover ever sent to Mars. It launched Nov. 26, 2011 and landed on Mars at 10:32 p.m. PDT on Aug. 5, 2012 (1:32 a.m. EDT on Aug. 6, 2012).

        Curiosity set out to answer the question: Did Mars ever have the right environmental conditions to support small life forms called microbes? Early in its mission, Curiosity's scientific tools found chemical and mineral evidence of past habitable environments on Mars. It continues to explore the rock record from a time when Mars could have been home to microbial life.`
    } else if (chosenRover == 'Opportunity') {
        return `Opportunity was the second of the two rovers launched in 2003 to land on Mars and begin traversing the Red Planet in search of signs of ancient water. The rover explored the Martian terrain for almost 15 years, far outlasting her planned 90-day mission.

        After landing on Mars in 2004, Opportunity made a number of discoveries about the Red Planet including dramatic evidence that long ago at least one area of Mars stayed wet for an extended period and that conditions could have been suitable for sustaining microbial life.`
    } else if (chosenRover == 'Spirit'){
        return `One of two rovers launched in 2003 to explore Mars and search for signs of past life, Spirit far outlasted her planned 90-day mission, lasting over six years. Among her myriad discoveries, Spirit found evidence that Mars was once much wetter than it is today and helped scientists better understand the Martian wind.

        In May 2009, the rover became embedded in soft soil at a site called "Troy" with only five working wheels to aid in the rescue effort. After months of testing and carefully planned maneuvers, NASA ended efforts to free the rover and eventually ended the mission on May 25, 2011.`
    }
}
