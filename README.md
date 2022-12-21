![alt text](https://global-uploads.webflow.com/60242ee565b2be8b567a2237/6053d0eea3ecbd6221fb3943_PS%20Logo%20Horizontal%20Light.png)

# Platform Science Test - Eric Montes de Oca

### **Requisites**
In order to run this program the following tools are required:
- Node v18.4
- npm v8.12.1^
- Git

#### **Dependencies**
To create a beautiful interface Colors.JS is required:
"colors": "^1.4.0"

#### **Project Structure**
The project has four folders:
`````
- docs -> Files that might serve for new developers to better understand the solution. In this case, a diagram flow in PDF format is provided.
`````
`````
- services -> JS files with specific functions.
`````
`````
- files -> Containts the files to be requested in the command line at the moment of the execution.
`````
`````
- node_modules -> Contains third party modules. Note: no third party modules were used for this solution.
`````

The main file is called **index.js**, this file is in charge of executing all the proccesses required for the solution.

#### **Installation**
Here is a list of simple steps to install the project:

1. Move to the desire folder in your computer and execute the following commando to clone the project from the repository:
`````
git clone 
`````
2. Access the folder with this command:
`````
cd [name_of_the_project]
`````
3. To install project's dependencies, run the following command:
`````
npm install
`````

#### **Execution**
To run this project, you will need to position in the project's folder and use this command:

`````
node index.js [destinations_file_name.txt] [drivers_names_file.txt]
`````

Both **destinations_file_name.txt** and **drivers_names_file.txt** should be replaced with the names of the files to be analyzed. 

Example:
`````
node index.js destinations.txt drivers_names.txt
`````
**Important:**
`````
NOTE: Both files must be placed inside the files/ folder.
`````

#### **Output**
The expected output must be shown in the command line and will be a text with the following structure:

`````
Driver's best suitability score calculator 

☑️  Validating files
✅ Validated files

RESULTS
Best suitability score: [number]
Destination: [destination address]
Driver: [drivers name]
`````

#### **Explained Solution**
After running the project, this steps will be followed:
`````
Note: A flow diagram with the solution can be found inside docs/.
`````
1. Perform validations to ensure that two files are being provided and exists in the folder files/. This validations are performed by the services/arguments.js . In case of failure, a error message describing the issue will be displayed.
2. Once the files have been validated, the driver's name file is read line by line. Each iteration analyzes the driver's name to get the number of vowels, consonants and the name´s length. While in this process, the destinations file is read line by line and each driver is assigned a specific best SS score and that destination is removed for the next driver's iteration. This is handled by the services/files.js .
3. In the same iteration, once the best SS score has been assigned to a driver a comparison is made to check if driver's current SS is greater than current best SS score, if true, then a new best SS score is asigned.
4. After the analysis is complete, the output should be the destination with the highest Suitability Score and the driver who should perform the task.