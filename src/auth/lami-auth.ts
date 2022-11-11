import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda"; 
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node";
 
type Event = {
    eventType: 'LOGIN' | 'REGISTER',
}

type LoginEvent = {
    data: {
        email: string,
        password: string,
        clientId: string,
    }
} & Event
export default class LamiAuth {
    private client: LambdaClient;
    private function_name: string;
    constructor(){
        let authEnv = process.env.AUTH_ENV;
        this.function_name = `${authEnv}-lami-auth`??"dev-lami-auth";
        this.client = new LambdaClient({});
    }

   
    protected async invoke(event: LoginEvent){
        try {
            const command = new InvokeCommand({
                FunctionName: this.function_name,
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

}
