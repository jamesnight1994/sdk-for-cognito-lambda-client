import Auth from  '../src/auth/auth'

require('dotenv').config();
const AUTH_FUNCTION = process.env.AUTH_FUNCTION??'';
const lamiAuth = new Auth(AUTH_FUNCTION);

it('Authentication function is working',async () => {
    expect.assertions(1);
    const data =  await lamiAuth.test();
    expect(data).toBe('Lami Auth is operational')
});