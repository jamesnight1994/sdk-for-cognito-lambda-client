import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda"; 
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node";

export default class Auth {
    private client: LambdaClient;
    private client_name: string;
    constructor(){
        this.client_name = process.env.AUTH_FUNCTION_NAME??"";
        this.client = new LambdaClient({});
    }
    
    async verify(data: {
        token: string,
        userPoolId: string,
        tokenUse: string,
        clientId: string
    }) {
        let event = {
            eventType: "VERIFY_ACCESS_TOKEN",
            data: {
                token: data.token,
                userPoolId: data.userPoolId,
                tokenUse: data.tokenUse,
                clientId: data.clientId
            }
        };
        console.log("Data ", event);
        try {
            const command = new InvokeCommand({
                FunctionName: this.client_name,
                Payload: fromUtf8(JSON.stringify(event)),
                LogType: 'Tail'
    
            });
            const { $metadata,Payload }: InvokeCommandOutput = await this.client.send(command)
            // if there is a challenge
            if (Payload != undefined) {
                return JSON.parse(toUtf8(Payload));
            } else {
                return $metadata;
            }
            
        } catch (err) {
             throw err;
        }
    }

    async login(data: any): Promise<UserLoggedIn | any>{
        console.log("login email", data.email);
        
        let event = {
            eventType: "LOGIN",
            data: {
                email: data.email,
                password: data.password,
                clientId: data.client_id
            }
        };
        console.log("Data ", event);
        try {
            const command = new InvokeCommand({
                FunctionName: this.client_name,
                Payload: fromUtf8(JSON.stringify(event)),
                LogType: 'Tail'
    
            });
            const { $metadata,Payload }: InvokeCommandOutput = await this.client.send(command)
            // if there is a challenge
            if (Payload != undefined) {
                return JSON.parse(toUtf8(Payload));
            } else {
                return $metadata;
            }
            
        } catch (err) {
             throw err;
        }
    }
    
    // TODO replace with call to VERIFY_APP_TOKEN event
    async getAuthApp(req: any): Promise<any> {
        try {
            const token = String(req.headers.authorization).split(" ")[1];
            const tokenDecoded: any = jwTokens.decode(token);
            console.log("token in", tokenDecoded);
            let client_id = "";
            if (typeof(tokenDecoded.client_id) !== "undefined") {
                client_id = tokenDecoded.client_id;
            }
            console.log("client_id", client_id);
            const appsQuery = "select * from apps where client_id = :client_id";
            const app: any = await sequelizeGeneral.query(
                appsQuery,
                {
                    replacements: {  client_id },
                    type: QueryTypes.SELECT
                }
            );
            console.log("APP", app);
            return app[0];
        } catch(err) {
            console.log("err getAuthApp", err);
            return null;
        }
    }

    async register(email: string,password: string, userPoolId: string): Promise<CreatedUser | any> {
        let event = {
            "eventType": "REGISTER",
            "data": {
                "email": email,
                "password": password,
                "userPoolId": userPoolId
            }
        };
        console.log("event", event);
        const command = new InvokeCommand({
            FunctionName: this.client_name,
            Payload: fromUtf8(JSON.stringify(event))
        });
        try {
            const { $metadata,Payload }: InvokeCommandOutput = await this.client.send(command);
            if(Payload != undefined){
                console.log(JSON.parse(toUtf8(Payload)));
                return JSON.parse(toUtf8(Payload));
            }else{
                return $metadata;
            }  
            
        } catch (err) {
             throw err;
        }
    }

    async getAccessToken(client_id:string ,client_secret: string) {
        let event = this.jsonToUint8Array({
            "eventType": "GET_ACCESS_TOKEN",
            "data": {
                "client_id": client_id,
                "client_secret": client_secret
            }
        });
        console.log("event", this.uint8ArrayToJson(event));
        const command = new InvokeCommand({
            FunctionName: this.client_name,
            Payload: event
        });
        try {
            const response: InvokeCommandOutput = await this.client.send(command);
            
            return this.uint8ArrayToJson(response.Payload);
        } catch (err) {
            return err;
        }
        
    }
}