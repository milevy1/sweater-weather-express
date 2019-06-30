const fetch = require('node-fetch');

module.exports = class DarkSkyService {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  async getData() {
    let response = await fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${this.latitude},${this.longitude}`)
    this.data = await response.json()
    return this
  }
}
