/**
 * Created by lucas on 12/22/15.
 */

import { IncomingMessage, ServerRequest, ServerResponse } from 'http';

interface ClientOptions {
    id: String,
    secret: String,
    apiHost?: String,
    protocol?: String,
}

interface ProxyConfig {
    prefix: String
}

export class Client {
    constructor(options: ClientOptions);

    get(resourcePath: String, callback?: (error: any, response: IncomingMessage) => void);

    proxy(config: ProxyConfig): (req: ServerRequest, res: ServerResponse, next: (error?: any) => void) => void;
}
