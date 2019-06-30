const fetch = require('node-fetch');

module.exports = class GoogleMapsService {
  constructor(location) {
    this.location = location;
  }

  async getData() {
    let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.location}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
    this.data = await response.json()
    this.latitude = this.data.results[0].geometry.location.lat
    this.longitude = this.data.results[0].geometry.location.lng
    return this
  }
}
