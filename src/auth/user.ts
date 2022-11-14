import LamiAuth from "./auth";

export default class User extends LamiAuth{
    private email: string;
    private password: string;

    constructor(email:string ,password: string) {
        super();
        this.email = email;
        this.password = password;
    }
    
    async login(clientId: string) {
        let event = {
            eventType: "LOGIN",
            data: {
                email: this.email,
                password: this.password,
                clientId: clientId
            }
        };
        console.log("Data ", event);
        return await this.invoke({
            eventType: "LOGIN",
            data: {
                email: this.email,
                password: this.password,
                clientId: clientId
            }
        });
    }

}