/*
|--------------------------------------------------------------------------
| Files Service
|--------------------------------------------------------------------------
|
| The Files Service is in charge of calculating the best SS by
| reading the driver's names files and the destinations file.
|
*/

/*
|--------------------------------------------------------------------------
| Required Files
|--------------------------------------------------------------------------
*/
// Required modules
const fs = require("fs")
const readline = require('readline')
const stringVerify = require('./strings')
/*
|--------------------------------------------------------------------------
| END Required Files
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Global Variables
|--------------------------------------------------------------------------
*/
// Constants
const SSEVENMULTIPLIER = 1.5
const SSODDMULTIPLIER = 1
const SSCOMMONFACTORMULTIPLIER = .5

// Variables
let bestDriverSS = ""
let bestDestinationSS = ""
let currentSSTop = 0
/*
|--------------------------------------------------------------------------
| END Global Variables
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/
/**
 * Check if file exists 
 * 
 * @param {string} filename
 * @return {object} response
 */
async function checkFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                reject({ 
                    success: false, 
                    message: `Error: File ${filename} not found. Please check that the file exists under /files/ folder inside this project.`
                })
            }

            // If file exists, return success true
            resolve({
                    success: true,
                    message: null
                })
        });
    });
}

/**
 * Calculate Destination Suitability Score based on Driver's Data
 * 
 * @param {int} destinationLength
 * @param {object} driverData
 * @return {int} suitabilityScore
 */
async function getSuitabilityScore(destinationLength, driverData) {
    return new Promise((resolve, reject) => {
        let suitabilityScore = 0

        // If the length of the shipment's destination street name is even, the base suitability score (SS) is the number of vowels in the driver’s name multiplied by 1.5.
        if (destinationLength % 2 == 0) {
            suitabilityScore = driverData[2] * SSEVENMULTIPLIER
        } 

        // If the length of the shipment's destination street name is odd, the base SS is the number of consonants in the driver’s name multiplied by 1.
        if (destinationLength % 2 != 0) {
            suitabilityScore = driverData[1] * SSODDMULTIPLIER
        }
        
        // If the length of the shipment's destination street name shares any common factors (besides 1) with the length of the driver’s name, the SS is increased by 50% above the base SS.
        if (destinationLength == driverData[0]) {
            suitabilityScore = suitabilityScore + (suitabilityScore * SSCOMMONFACTORMULTIPLIER)
        }

        resolve(suitabilityScore)
    })
}

/**
 * Read destinations file line by line,
 * and get the suitability score for each destination based on driver's information
 * 
 * @param {string} destinationsFile, 
 * @param {array} driverData
 * @return {array} destinationDetail 
 */
async function readDestinations(destinationsFile, ...driverData) {
    // Define drivers file is to be read line by line
    const destinationsFileStream = fs.createReadStream(destinationsFile);
    
    // Create read line interface for drivers file
    const rlDestinations = readline.createInterface({
        input: destinationsFileStream,
        crlfDelay: Infinity
    });

    let destinationDetail = []

    for await (const destination of rlDestinations) {
        // Verify destination length
        const suitabilityScore = await getSuitabilityScore(destination.length, driverData)

        // Get the best SS, by doing a comparison
        if (suitabilityScore > currentSSTop) {
            currentSSTop = suitabilityScore
            bestDestinationSS = destination
            bestDriverSS = driverData[3]
        }

        destinationDetail.push({
            destination,
            suitabilityScore
        })
    }
    
    return destinationDetail
}

/**
 * Read driver's name file line by line,
 * and extract content by spliting line jumps.
 * After that get the best SS comparing against destinations address.
 * 
 * @param {string} destinationsFile, 
 * @param {string} driversFile
 * @return {object} bestSSObject
 */
async function readFiles(destinationsFile, driversFile) {
    // Define the array that will store of the analysis information
    let driversList = [] 

    // Define drivers file is to be read line by line
    const driversFileStream = fs.createReadStream(driversFile);
    
    // Create read line interface for drivers file
    const drivers_rl = readline.createInterface({
        input: driversFileStream,
        crlfDelay: Infinity
    });

    // Read drivers file line by line and create an array of objects
    // with the suitability score analysis for each driver and destination
    for await (const driver of drivers_rl) {
        // Get driver's name details
        const nameLength = driver.length
        const vowels = stringVerify.countVowels(driver)
        const consonants = stringVerify.countConsonants(driver)

        // Compare suitability score
        const destinationsList = await readDestinations(destinationsFile, nameLength, vowels, consonants, driver)

        // Add driver detail to drivers list, and create a file with the analysis
        // driversList.push({
        //     driver,
        //     nameLength,
        //     vowels,
        //     consonants,
        //     destinationsList
        // })
    }
    
    // Return object with information about the best destination and the driver who should perform the task
    return {
                currentSSTop,
                bestDriverSS,
                bestDestinationSS
            }
}
/*
|--------------------------------------------------------------------------
| END Functions
|--------------------------------------------------------------------------
*/

module.exports = {
                    checkFile,
                    readFiles
                }