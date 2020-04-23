/*GeoNames*/
let baseURL = 'http://api.geonames.org/searchJSON?q='
const apiKey = '&username=ch3b3ts';

/*Weatherbit*/
let baseURLweather = 'https://api.weatherbit.io/v2.0/forecast/daily?'
const apiKeyWeather = 'b6622d7bbf6843c1b92e82c0c44cc8a9';

/*Pixabay*/
let baseURLPixabay = 'https://cors-anywhere.herokuapp.com/https://pixabay.com/api/'
const apiKeyPixabay = '&key=16027588-fcf7b42ae8f04c207e0c5e1d0';

//input data
const inputCity = document.getElementById('city');

//output data
const sd = document.getElementById('sd');
const vd = document.getElementById('vd');
const outputImage = document.getElementById('result_image');
const outputCity = document.getElementById('cityOutput');
const outputWeather = document.getElementById('weather');
const outputLat = document.getElementById('lat');
const outputLong = document.getElementById('long');

//variables for updateUI
var { start_date, end_date, country_name, city_name, weather, lat, long, image } = ''

const savingData = async (path, data) => {
  try {
    await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw 'error';
  }
}

const fetchCityData = async (baseURL, city, apiKey) => {
  const res = await fetch(baseURL+city+apiKey)
    try {
      const data = await res.json();
      console.log(data)
      country_name = data.geonames[0].countryName
      long = data.geonames[0].lng;
      lat = data.geonames[0].lat;

      //date calculation
      const startDate =  document.getElementById('startDate').value;
      const endDate =  document.getElementById('endDate').value;

      let d = new Date();
      let newDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
      function parseDate(input) {
        let parts = input.match(/(\d+)/g);
        return new Date(parts[0], parts[1]-1, parts[2]); 
      }

      var Difference_In_Time = parseDate(startDate).getTime() - parseDate(newDate).getTime(); 
      var Difference_In_Vacation = parseDate(endDate).getTime() - parseDate(startDate).getTime(); 
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      var Difference_In_Vacation_In_Days = Difference_In_Vacation / (1000 * 3600 * 24);

      start_date = Difference_In_Days;
      end_date = Difference_In_Vacation_In_Days;


      const weatherInfo = fetch(baseURLweather+'lat='+ lat +'&lon='+ long +'&key='+apiKeyWeather).then( (weatherResponse) => {
        return weatherResponse.json(); 
      }).then((dataWeather) => {
        weather = dataWeather.data[0].weather.description
        console.log(dataWeather)
        city_name = dataWeather.city_name

        const imageInfo = fetch(baseURLPixabay+'?safesearch'+ apiKeyPixabay + '&q=' + city + '+city' + '&image_type=photo')
          .then( (imageResponse) => {
            return imageResponse.json(); 
          })
          .then((imagedata) => {
            console.log(imagedata)
            const imageSrc = imagedata.hits[0].webformatURL
            image = `<img src="${imageSrc}" />`
            updatingUI(start_date, end_date, country_name, city_name, weather, lat, long, image)
          })
      })
      .then(data => {
        savingData('/api/projectdata', data)
        return data
      })
      
    } catch (error) {
      console.log("error", error);
    }   
}

document.getElementById('generate').addEventListener('click', () => {
    fetchCityData(baseURL, inputCity.value, apiKey)
      .then(countryName => {
        return { countryName };
      }).catch(err => {
        console.error(err);
    })
})

const updatingUI = async (start_date, end_date, country_name, city_name, weather, lat, long, image) => {
  document.getElementById('result').style.display = 'block';
  sd.innerHTML = start_date;
  vd.innerHTML = end_date;
  outputCity.innerHTML = `${city_name}, ${country_name}`;
  outputWeather.innerHTML = weather;
  outputLat.innerHTML = lat;
  outputLong.innerHTML = long;
  outputImage.innerHTML = image;
}