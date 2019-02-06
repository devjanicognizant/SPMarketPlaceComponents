export default class LogManager {
    static logException(exception: any, msg: string, componentName: string, methodName: string): void;
    static logMessage(msg: string): void;
    static logObject(obj: any): void;
}
