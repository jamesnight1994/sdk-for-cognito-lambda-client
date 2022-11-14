import LamiAuth from "./auth";

export default class User extends LamiAuth{
    private email: string;
    private password: string;

    /**
     * Login or register user
     * @param email - User email
     * @param password - User password
     */
    constructor(email:string ,password: string) {
        require('dotenv').config();
        const AUTH_FUNCTION = process.env.AUTH_FUNCTION??'';
        super(AUTH_FUNCTION);
        this.email = email;
        this.password = password;
    }
    
    /**
     * Login and get the token
     * @param clientId - Application client ID
     * @returns - On success { access_token: string, token_type: string, expires_in:string, refresh_token:string }
     */
    async login(clientId: string): Promise<any> {
        return await this.invoke({
            eventType: "LOGIN",
            data: {
                email: this.email,
                password: this.password,
                clientId: clientId
            }
        });
    }

    /**
     * 
     * @param userPoolId - The userpool id the user belongs to
     * @returns @returns - On success { access_token: string, token_type: string, expires_in:string, refresh_token:string }
     */
    async register(userPoolId: string): Promise<any> {
        return await this.invoke({
            "eventType": "REGISTER",
            "data": {
                email: this.email,
                password: this.password,
                userPoolId: userPoolId
            }
        });
    }

}