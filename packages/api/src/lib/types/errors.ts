// @ts-expect-error pronoun enum imported for jsdoc.
import { PronounEnum, RESTGetAPIUsersUserBansBan } from './rest'; // lgtm [js/unused-local-variable]

export enum RESTJSONErrorCodes {
    /**
     * Error code `405` "Method not allowed".
     * Returned when attemping to access a route with a HTTP method that is not supported.
     */
    MethodNotAllowed = 405,
    /**
     * Error code `10001` "User not found".
     * Given when a user is attemping to be reaching but cannot be found in the API.
     */
    UserNotFound = 10001,
    /**
     * Error code `20001` "User Already Exists".
     * Given when attemping to create a user and that user already exists.
     */
    UserAlreadyExists = 20001,
    /**
     * Error code `30001` "Invalid pronouns".
     * Given when pronouns specified in a request body do not exist on the {@link PronounEnum}.
     */
    InvalidPronouns = 30001,
    /**
     * Error code `30002` "Invalid Ban"
     * Given when a ban object is either incomplete or malformed.
     * See {@link RESTGetAPIUsersUserBansBan}.
     */
    InvalidBan = 30002
}
