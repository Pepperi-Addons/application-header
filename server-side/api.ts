import { Client, Request } from '@pepperi-addons/debug-server'
import AppHeadesService from './services/header.service'

export async function headers(client: Client, request: Request) {
    try {
        const service = new AppHeadesService(client);

        if (request.method === 'GET') {
            return service.getHeaders(request?.query);
        }
        else if (request.method === 'POST') {
                return service.upsertHeader(request.body);        
        } 
        else {
            throw new Error(`Method ${request.method} not supportded`);
        }
    }
    catch (err) {
        throw new Error(`Failed with error - ${err}`);
    }
}

export async function duplicateHeader(client: Client, request: Request) {
    try {
        const service = new AppHeadesService(client);

        if (request.method === 'POST') {
                return service.duplicateHeader(request.body);        
        } 
        else {
            throw new Error(`Method ${request.method} not supportded`);
        }
    }
    catch (err) {
        throw new Error(`Failed with error - ${err}`);
    }
}

export async function deleteHeader(client: Client, request: Request) {
    try {
        const service = new AppHeadesService(client);

        if (request.method === 'POST') {
                return service.deleteHeader(request.body);        
        } 
        else {
            throw new Error(`Method ${request.method} not supportded`);
        }
    }
    catch (err) {
        throw new Error(`Failed with error - ${err}`);
    }
}


export async function header_import(client:Client, request: Request): Promise<any> {
    try {
        const service = new AppHeadesService(client);
        console.log('@@@@@@@@ draft_pages_import - before importPages ', JSON.stringify(request.body));
        const res = await service.importHeader(request.body);
        console.log('@@@@@@@@ draft_header_import - after importPages ', JSON.stringify(res));

        return res;
        
    } catch(err) {
        throw err;
    }
}

export async function header_export(client:Client, request: Request): Promise<any> {
    try {
        const service = new AppHeadesService(client);
        return await service.exportHeader(request.body);
    } catch(err) {
        throw err;
    }
}