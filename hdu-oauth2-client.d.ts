/**
 * Created by lucas on 12/22/15.
 */

declare module 'hdu-oauth2-client' {
    import { IncomingMessage, ServerRequest, ServerResponse } from 'http';
    
    interface ClientOptions {
        id: string,
        secret: string,
        apiHost?: string,
        protocol?: string,
    }
    
    interface ProxyConfig {
        prefix: string
    }
    
    export class Client {
        constructor(options: ClientOptions);
        
        get(resourcePath: string, callback?: (error: any, response: IncomingMessage, body: any) => void);
        
        proxy(config: ProxyConfig): (req: ServerRequest, res: ServerResponse, next: (error?: any) => void) => void;
    }

}
