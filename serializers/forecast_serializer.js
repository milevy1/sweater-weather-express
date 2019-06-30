module.exports = class ForecastSerializer {
  constructor(weather_data, location_data) {
    this.weather_data = weather_data;
    this.location_data = location_data;
  }

  response() {
    return {
      "location":  this.location(),
      "currently": this.currently(),
      "hourly":    this.hourly(),
      "daily":     this.daily()
    }
  }

  location() {
    return this.location_data
               .data
               .results[0]
               .formatted_address
  }

  currently() {
    let c = this.weather_data.data.currently
    return {
      "summary":           c.summary,
      "icon":              c.icon,
      "precipIntensity":   c.precipIntensity,
      "precipProbability": c.precipProbability,
      "temperature":       c.temperature,
      "humidity":          c.humidity,
      "pressure":          c.pressure,
      "windSpeed":         c.windSpeed,
      "windGust":          c.windGust,
      "windBearing":       c.windBearing,
      "cloudCover":        c.cloudCover,
      "visibility":        c.visibility
    }
  }

  hourly() {
    let hourly_data = this.weather_data.data.hourly
    return {
    "summary": hourly_data.summary,
    "icon":    hourly_data.icon,
    "data":    hourly_data.data.map(this.serializeHourly)
    }
  }

  serializeHourly(hourly_data_point) {
    let h = hourly_data_point
    return {
      "time":              h.time,
      "summary":           h.summary,
      "icon":              h.icon,
      "precipIntensity":   h.precipIntensity,
      "precipProbability": h.precipProbability,
      "temperature":       h.temperature,
      "humidity":          h.humidity,
      "pressure":          h.pressure,
      "windSpeed":         h.windSpeed,
      "windGust":          h.windGust,
      "windBearing":       h.windBearing,
      "cloudCover":        h.cloudCover,
      "visibility":        h.visibility
      }
  }

  daily() {
    let daily_data = this.weather_data.data.daily
    return {
    "summary": daily_data.summary,
    "icon":    daily_data.icon,
    "data":    daily_data.data.map(this.serializeDaily)
    }
  }

  serializeDaily(daily_data_point) {
    let d = daily_data_point
    return {
        "time":                   d.time,
        "summary":                d.summary,
        "icon":                   d.icon,
        "sunriseTime":            d.sunriseTime,
        "sunsetTime":             d.sunsetTime,
        "precipIntensity":        d.precipIntensity,
        "precipIntensityMax":     d.precipIntensityMax,
        "precipIntensityMaxTime": d.precipIntensityMaxTime,
        "precipProbability":      d.precipProbability,
        "precipType":             d.precipType,
        "temperatureHigh":        d.temperatureHigh,
        "temperatureLow":         d.temperatureLow,
        "humidity":               d.humidity,
        "pressure":               d.pressure,
        "windSpeed":              d.windSpeed,
        "windGust":               d.windGust,
        "cloudCover":             d.cloudCover,
        "visibility":             d.visibility,
        "temperatureMin":         d.temperatureMin,
        "temperatureMax":         d.temperatureMax
      }
  }
}
