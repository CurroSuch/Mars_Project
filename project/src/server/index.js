const fetch = require ('node-fetch')
const express = require ('express')
const bodyParser = require ('body-parser')
const path = require ('path')

require('dotenv').config()

const app = express()
const port = 3000

app.use(express.static('./src/public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/apod/:rover', async (req, res) => {
    try {
        const rover = req.params.rover
        let i = 0;
        let response;
        let images = { photos: [] }; 
        while (images.photos.length == 0) {
            const today = new Date();
            today.setDate(today.getDate()-i)
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate());
            if (rover ==='Curiosity'){
                date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate());
                let URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
                response = await fetch(URL);
                images = await response.json();
                i++;
            } else if (rover === 'Opportunity'){
                date = today.getFullYear()-4+'-'+(today.getMonth()+6)+'-'+(today.getDate())
                let URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
                console.log(URL)
                response = await fetch(URL);
                images = await response.json();
                i++;
            } else if (rover === 'Spirit'){
                date = today.getFullYear()-12+'-'+(today.getMonth()+3)+'-'+(today.getDate())
                let URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
                console.log(URL)
                response = await fetch(URL);
                images = await response.json();
                i++;
            }
        }
        res.send({ images })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))




