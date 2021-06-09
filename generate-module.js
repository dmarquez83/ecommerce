/**
 *  To generate entire module just run "npm run resource -- new_module_name_in_plurar"
 */

const execSync = require('child_process').execSync;

const arg = process.argv.slice(-1).pop();

if (arg) {
    execSync(`nest g mo modules/${arg}`, {stdio:[0, 1, 2]}); //generate the module
    execSync(`nest g s modules/${arg}`, {stdio:[0, 1, 2]}); //generate the service
    execSync(`nest g co modules/${arg}`, {stdio:[0, 1, 2]}); //generate the controller
}