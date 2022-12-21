/*
|--------------------------------------------------------------------------
| Arguments Service
|--------------------------------------------------------------------------
|
| The Arguments Service should handle all the functions regarding
| to validation.
|
*/

/*
|--------------------------------------------------------------------------
| Required Files
|--------------------------------------------------------------------------
*/
const fileService = require("./files")
const {join, resolve} = require('path')
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
// Set the number of files required to be sent in parameters
const FILESREQUIRED = 2
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
 * Define validation rules for the arguments provided by command line
 * 
 * @param array args 
 * @return void
 */
async function validate(args) {
    return new Promise(async (resolve, reject) => {
        // Check existance of destinations and drivers_name file
        try {
            // Check if two arguments have been provided
            await required(args.length)

            // Destinations file
             const destinationsFile = join(__dirname, '..', 'files', args[2])
             await fileService.checkFile(destinationsFile)
             
             // Driver's names file
             const driversFile = join(__dirname, '..', 'files', args[3])
             await fileService.checkFile(driversFile)

             return resolve({
                success: true,
                message: null
            })
        } catch (error) {
            return reject(error)
        }
    })
}

/**
 * Check if two arguments have been provided
 * 
 * @param {int} argsLength 
 * @return boolean
 */
async function required(argsLength) {
    return new Promise((resolve, reject) => {
        // Default 2, because process.argv first two values always correspond to NodeJs's route and to the file that is executing the script
        if (argsLength != (2 + FILESREQUIRED)) {
            reject({
                success: false,
                message: 'Expecting 2 files.'
            })
        }

        resolve({
            success: true,
            message: null
        })
    })
}
/*
|--------------------------------------------------------------------------
| END Functions
|--------------------------------------------------------------------------
*/

module.exports = { validate };