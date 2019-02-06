import { Logger, ConsoleListener, LogLevel } from "sp-pnp-js";
// Subscribe a console listener to enable logging mechanism
Logger.subscribe(new ConsoleListener());
// Set the active log level as information
Logger.activeLogLevel = LogLevel.Error;
// Helper class to manage exception, log etc
var LogManager = (function () {
    function LogManager() {
    }
    // Log exception along with component name and method name from where the exception is generated
    LogManager.logException = function (exception, msg, componentName, methodName) {
        Logger.write("Component Name: " + componentName
            + ". Method Name: " + methodName
            + ". Message:" + msg
            + ". Error Message:" + exception.message, LogLevel.Error);
        //Logger.write(exception, LogLevel.Error);
    };
    // Log any mesage
    LogManager.logMessage = function (msg) {
        Logger.write(msg, LogLevel.Error);
    };
    // Convert the object to json and log the same
    LogManager.logObject = function (obj) {
        Logger.writeJSON(JSON.stringify(obj), LogLevel.Error);
    };
    return LogManager;
}());
export default LogManager;
//# sourceMappingURL=LogManager.js.map