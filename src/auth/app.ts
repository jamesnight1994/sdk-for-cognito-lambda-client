import Auth from "./auth";

export default class App extends Auth{
    private clientId;

    constructor(clientId: string){
        require('dotenv').config();
        const AUTH_FUNCTION = process.env.AUTH_FUNCTION??'';
        super(AUTH_FUNCTION);
        this.clientId = clientId;
    }

    /**
     * Get partner access 
     *  
     * @param clientSecret - the client secret
     * @returns On success { access_token: string, token_type: string, expires_in:string, refresh_token:string }
     */
    async getAccessToken(clientSecret: string): Promise<any> {
        return await this.invoke({
            eventType: "GET_ACCESS_TOKEN",
            data: {
                client_id: this.clientId,
                client_secret: clientSecret
            }
        });
    }

    async verify(token: string, tokenUse: 'bearer'| 'access', userPoolId: string): Promise<any> {
        return await this.invoke({
            eventType: "VERIFY_ACCESS_TOKEN",
            data: {
                token: token,
                userPoolId: userPoolId,
                tokenUse: tokenUse,
                clientId: this.clientId
            }
        })
    }
}