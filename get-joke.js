// Request random joke, and sent to another function
// for processing

const axios = require("axios")

// input and output URI 
const jokeApiUri = "http://api.icndb.com/jokes/random"
var processUri = process.env['TARGET_URL'] || 'http://hello.default.svc.cluster.local'

var timer = null

function clearTimer() {
    // helper for set interval 	
    clearInterval(timer)
    timer = null
}

function postRequest(joke) {
    // helper for sending POST request to the next function in pipe
    axios({
            method: 'post',
            url: processUri,
            data: joke,
            config: {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        })
        .then(function(response) {
            console.log('HTTP POST request was successfull')
            console.log(response.data);
        })
        .catch(function(response) {
            console.log("Error." + response);
        })
}

function getJoke() {
    // get joke and send it to the next function for processing	

    axios({
            method: 'get',
            url: jokeApiUri
        })
        .then(function(response) {
            console.log('HTTP GET request was successfull')
            console.log('Sending to the processor function')
            postRequest(response.data.value.joke)
        })
        .catch(function(response) {
            clearTimer()
            console.log("Error." + response);
        })

}

module.exports = x => {

    if (x.hasOwnProperty('url')) { processUri = x.url }	
    clearTimer();
    timer = setInterval(getJoke, 5000)
    console.log('Posting joke for processing')

}
