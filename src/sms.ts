import { LambdaClient, InvokeCommand, InvokeCommandOutput } from "@aws-sdk/client-lambda"; 
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node";
 
type Event = {
    eventType: 'SEND_SMS'| 'TEST'
}

type SendSMSEvent = {
    data: {
        Message: string
        PhoneNumber: string,
        Subject: string
    }
} & Event

type TestEvent =  {} & Event
export default class SMS {
    private client: LambdaClient;
    private function_name: string;
    constructor(functionName: string){
        this.function_name = functionName;
        this.client = new LambdaClient({});
    }

    protected async invoke(event: SendSMSEvent|TestEvent){
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

    /**
     * Send SMS/Text message to phone number
     * 
     * @param message - message
     * @param subject - subject of the message
     * @param phoneNumber - user phone number
     * @returns 
     */
    async send(message: string,subject: string,phoneNumber: string){
        return await this.invoke({
            eventType: 'SEND_SMS',
            data: {
                Message: message,
                PhoneNumber: phoneNumber,
                Subject: subject
            }
        });
    }
    
    async test(){
        return this.invoke({
            eventType: 'TEST'
        })
    }
}