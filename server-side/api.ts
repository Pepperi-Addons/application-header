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
        return await service.importHeader(request.body);  
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

export async function get_headers_data_views_data(client: Client, request: Request): Promise<any> {
    try {
        const service = new AppHeadesService(client);
        return service.getHeadersDataViewsData();
    } catch(err) {
        throw new Error(`Failed to get headers data views data. error - ${err}`);
    }
}

export async function get_mapped_headers(client: Client, request: Request): Promise<any> {
    try {
        const service = new AppHeadesService(client);
        return service.getMappedHeaders();
    } catch(err) {
        throw new Error(`Failed to get mapped headers. error - ${err}`);
    }
}

export async function on_delete_header(client:Client, request: Request): Promise<any> {
    try {
        const service = new AppHeadesService(client);
        await service.deleteHeaderFromSlugMappings(request.body);
    } catch(err) {
        throw new Error(`Failed to delete slug mappings. error - ${err}`);
    }
}

export async function on_publish(client:Client, request: Request): Promise<any> {
    // TODO: Implement
}