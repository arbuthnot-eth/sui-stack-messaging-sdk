export declare class MessagingClientError extends Error {
}
export declare class UserError extends MessagingClientError {
}
export declare class MessagingAPIError extends MessagingClientError {
    #private;
    requestId?: string | undefined;
    status?: number | undefined;
    constructor(message: string, requestId?: string | undefined, status?: number | undefined);
    static assertResponse(response: Response, requestId: string): Promise<void>;
}
export declare class ApiNotImplementedFeatureError extends MessagingAPIError {
    constructor(requestId?: string);
}
/** General server errors that are not specific to the Messaging API (e.g., 404 "Not Found") */
export declare class GeneralError extends MessagingAPIError {
}
export declare class NotImplementedFeatureError extends UserError {
    constructor();
}
export declare function toMajorityError(errors: Error[]): Error;
