/*
|--------------------------------------------------------------------------
| Index File
|--------------------------------------------------------------------------
|
| Index file is the orchestrator of the whole process,
| it's in charge of getting the parameters, execute validations on them,
| and finally request the analysis to get the best Suitability Score (SS).
|
*/

/*
|--------------------------------------------------------------------------
| Required Files
|--------------------------------------------------------------------------
*/
// Required modules
const {join} = require('path')
var colors = require('colors');

// Required services
const argsValidator = require("./services/arguments")
const fileService = require("./services/files")
/*
|--------------------------------------------------------------------------
| END Required Files
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/
/**
 * Main function in charge of executing all the processes required
 * 
 * @params {array} args
 * @return {string} bestSS
 */
async function main(args) {
    // Validate files have been provided
    try {
        console.log(colors.bold.blue("Driver's best suitability score calculator \n"))
        console.log(colors.italic.green.underline("☑️  Validating files"))
        await argsValidator.validate(args)
        console.log(colors.italic.green.underline("✅ Validated files"))
    } catch (validationError) {
        console.log(colors.bold.red.underline('ERROR:'))
        throw new Error(validationError.message)
    }

    // Compare Drivers names list against Destinations lists to get Score Suitability
    destinationsFile = join(__dirname, 'files', args[2])
    driversFile = join(__dirname, 'files', args[3])

    driversSuitabilityScore = await fileService.readFiles(destinationsFile, driversFile)

    // Return the best destination and the driver who should perform the task
    console.log(colors.bold.blue("\nRESULTS")) 
    console.log(colors.bgBrightBlue(" Best suitability score: ")) 
    console.log(colors.bold.yellow(` ${driversSuitabilityScore.currentSSTop}`)) 
    console.log(colors.bgBrightBlue("\n Destination: "))
    console.log(colors.bold.yellow(` ${driversSuitabilityScore.bestDestinationSS}`))
    console.log(colors.bgBrightBlue("\n Driver: "))
    console.log(colors.bold.yellow(` ${driversSuitabilityScore.bestDriverSS}`))

    return true
}

/*
|--------------------------------------------------------------------------
| END Functions
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Main process
|--------------------------------------------------------------------------
*/
// Read arguments from command line
const args = process.argv

// Execute main function 
main(args)