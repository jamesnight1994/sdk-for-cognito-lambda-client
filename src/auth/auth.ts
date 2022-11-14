import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda"; 
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node";
 
type Event = {
    eventType: 'GET_ACCESS_TOKEN' | 'LOGIN' | 'REGISTER' | 'TEST' | 'VERIFY_ACCESS_TOKEN'
}

type VerifyAccessTokenEvent = {
    data: {
        token: string,
        userPoolId: string,
        tokenUse: string,
        clientId: string
    }
} & Event

type GetAccessTokenEvent = {
    data: {
        client_id: string,
        client_secret: string
    }
} & Event

type LoginEvent = {
    data: {
        email: string,
        password: string,
        clientId: string,
    }
} & Event

type RegisterEvent = {
    data: {
        email: string,
        password: string,
        userPoolId: string,
    }
} & Event

type TestEvent =  {} & Event
export default class Auth {
    private client: LambdaClient;
    private function_name: string;
    constructor(functionName: string){
        this.function_name = functionName;
        this.client = new LambdaClient({});
    }

   
    protected async invoke(event: GetAccessTokenEvent| LoginEvent | RegisterEvent |TestEvent| VerifyAccessTokenEvent){
        try {
            const command = new InvokeCommand({
                FunctionName: this.function_name,
                Payload: fromUtf8(JSON.stringify(event)),
                LogType: 'Tail'
    
            });
            const { $metadata,Payload }: InvokeCommandOutput = await this.client.send(command)
            if (Payload != undefined) {
                return JSON.parse(toUtf8(Payload));
            } else {
                return $metadata;
            }
            
        } catch (err) {
             throw err;
        }

    }
    
    async test(){
        return this.invoke({
            eventType: 'TEST'
        })
    }

}
