World Weather Feed - A Blockchain Weather Feed

This app uses ARWeave Blockchain to store weather data from MetaWeather

## How To Run the script
* 1st parameter is the ARWeave private key filename/location

* 2nd parameter is the WOEID for a particular location([*WOEID List*](https://github.com/sunnymodi21/weather-arbot/blob/master/woeid.md))

Run command: 
```
node aggregate-job.js arweave-keyfile.json 44418
```

Link to the wallet address that has been archiving your data stream:
https://viewblock.io/arweave/address/D60F9egY38jzaJcEHeuOFV8pegPK4lqEClpfok2Ncq4

## Data is archived every 24hr in `JSON` format:
Source of the data is https://www.metaweather.com/api/

| Field         | Type                    | Unit | Description                                  | 
|---------------|-------------------------|------|----------------------------------------------| 
| latt_long     | floats, comma separated |      |                                              | 
| time          | datetime                |      | Time in location                             | 
| timezone_name | string                  |      | Name of the timezone that the location is in | 
| woeid         | integer                 |      | Where on Earth ID                            | 
| title         | string                  |      | Name of the location                         | 


* data:
| id                     | integer |               | Internal identifier for the forecast                                                                              |
|------------------------|---------|---------------|-------------------------------------------------------------------------------------------------------------------|  
| applicable_date        | date    |               | Date that the forecast or observation pertains to                                                                 | 
| weather_state_name     | string  |               | Text description of the weather state                                                                             | 
| weather_state_abbr     | string  |               | One or two letter abbreviation of the weather state                                                               | 
| wind_speed             | float   | mph           |                                                                                                                   | 
| wind_direction         | float   | degrees       |                                                                                                                   | 
| wind_direction_compass | string  | compass point | Compass point of the wind direction                                                                               | 
| (min\|max\|the)_temp   | integer | centigrade    |                                                                                                                   | 
| air_pressure           | float   | mbar          |                                                                                                                   | 
| humidity               | float   | percentage    |                                                                                                                   | 
| visibility             | float   | miles         |                                                                                                                   | 
| predictability         | integer | percentage    | Our interpretation of the level to which the forecasters agree with each other - 100% being a complete consensus. | 



# ARweave tags used to filter data:

* `feed-type` is always `world-weather-feed`, use to search for all transactions in the stream.
* `date` in `YYYY-MM-DD` format, used to search data points by date.
* `locationname` is case-sensitive, example: London, San Francisco, etc

## ArQL Example
* Get all Data:
{
    op: "and",
    expr1: {
        op: "equals",
        expr1: "from",
        expr2: "D60F9egY38jzaJcEHeuOFV8pegPK4lqEClpfok2Ncq4"
    },
    expr2: {
        op: "equals",
        expr1: "feed-type",
        expr2: "world-weather-feed"
    }
}

* Get all data for a location, eg: London:
```
{
    op: "and",
    expr1: {
        op: "equals",
        expr1: "from",
        expr2: "D60F9egY38jzaJcEHeuOFV8pegPK4lqEClpfok2Ncq4"
    },
    expr2: {
        op: "and",
        expr1: {
            op: "equals",
            expr1: "feed-type",
            expr2: "world-weather-feed"
        },
        expr2: {
            op: "equals",
            expr1: "locationname",
            expr2: "London"
        }
    }
}
```

* Get data for London for date 2019-12-27:
```
{
    op: "and",
    expr1: {
        op: "equals",
        expr1: "from",
        expr2: "D60F9egY38jzaJcEHeuOFV8pegPK4lqEClpfok2Ncq4"
    },
    expr2: {
        op: "and",
        expr1: {
            op: "equals",
            expr1: "feed-type",
            expr2: "world-weather-feed"
        },
        expr2: {
            op: "and",
            expr1: {
            op: "equals",
            expr1: "locationname",
            expr2: "London"
            },
            expr2: {
            op: "equals",
            expr1: "date",
            expr2: "2019-12-27"
            }
        }
    }
}
``` 

