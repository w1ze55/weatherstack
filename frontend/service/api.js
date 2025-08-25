import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.weatherstack.com/forecast?access_key=19426f6f8308c9',
  params: {
    query: "New York",
    forecast_days: 7
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}