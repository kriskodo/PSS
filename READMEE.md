# What is the project for?

API for Pontica-React-Extension.

# Usage
The steps to start using the extension are the following:  
1. All the core logic is in index.js(can be separated in different files if required)  
2. Adding a new script is done the following way:  
  2.1. Add script data to the end of _scriptsInformation_ object.  
  2.2. In **window.Pontica.exec** add an if check using _window.location_ and state[(previousLast + 1)]  
