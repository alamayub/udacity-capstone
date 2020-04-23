projectData = {};
const express = require('express');
const app = express();

/* Middleware*/
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('dist'));

const port = 8888;

const server = app.listen(port, listening);

function listening() {
    console.log(`Project is running on localhost:${port}`);
};
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.post('/api/projectdata', (request, response) => {
    const {start_date, end_date, country_name, city_name, weather, lat, long, image} = request.body
    projectData[start_date, end_date, country_name, city_name, weather, lat, long, image] = {
        start_date, end_date, country_name, city_name, weather, lat, long, image
    }
    response.status(201).send()
})