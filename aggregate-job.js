const https = require('https')
const fs = require('fs')
const Arweave = require('arweave/node')

const myArgs = process.argv.slice(2) 

let rsaKeyText = fs.readFileSync(myArgs[0])
const rsaKey = JSON.parse(rsaKeyText)
const dayInMilliseconds = 1000 * 60 * 60 * 24
let arweave

async function initialize(){
  arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})
  const address = await arweave.wallets.jwkToAddress(rsaKey)
  publicAddress = address
}

function getWeatherData(woeid){
  return new Promise ((resolve, reject) => {
    let url = 'https://www.metaweather.com/api/location/'+woeid+'/'
    const req = https.get(url, function(res) {
        let body = ""

        res.on('data', function(chunk){
            body += chunk 
        }) 
    
        res.on('end', function(){
            let weatherData = JSON.parse(body)
            resolve(weatherData) 

        }) 
    })

    req.on('error', (error) => {
      reject(error) 
    })

    req.end()
  })
}


function addWeatherData(weatherData, locationname){
  let dateObj = new Date(weatherData.time)
  let formattedDate = toYYYYMMDD(dateObj)
  let weatherDataFormatted = {}
  weatherDataFormatted.data = weatherData.consolidated_weather[0]
  weatherDataFormatted.time = weatherData.time
  weatherDataFormatted.timezone_name = weatherData.timezone_name
  weatherDataFormatted.title = weatherData.title
  weatherDataFormatted.woeid = weatherData.woeid
  weatherDataFormatted.latt_long = weatherData.latt_long
  return createTransaction(JSON.stringify(weatherDataFormatted), locationname, formattedDate)
}

async function createTransaction(data, locationname, date){
  let transaction = await arweave.createTransaction({
      data
  }, rsaKey)
  transaction.addTag('feed-type', 'world-weather-feed')
  transaction.addTag('locationname', locationname)
  transaction.addTag('date', date)
  await arweave.transactions.sign(transaction, rsaKey)
  const response = await arweave.transactions.post(transaction)
  return response
}

function toYYYYMMDD(date){
  if(date) return  date.getFullYear() +'-' +(date.getMonth()+1) + '-' + date.getDate()
  else return ''
}

async function addFeed(){
  let woeid = myArgs[1]
  let weatherData = await getWeatherData(woeid)
  let locationname = weatherData.title
  let response = await addWeatherData(weatherData, locationname)
  console.log(response.status)
  if(response.status!==200){
    console.log('transaction failed', response.status)
  }
}

(async () => {
  if(myArgs[1]=='' || myArgs[2]=='' || myArgs[1]==undefined || myArgs[2]==undefined){
    console.log('Invalid Parameter')
  } else{
    await initialize()
    console.log('Feed Job Started. This collect weather data every 24hrs')
    await addFeed()
    setInterval(async()=>{
      await addFeed()
    }, dayInMilliseconds)
  }
})()