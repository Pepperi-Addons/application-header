
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, errorMessage:{the reason why it is false}}
The error Message is important! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server';
import { RelationsService } from './services/relations.service';

const pnsKeyForHeader = 'delete_header_subscription';
const pnsFunctionPathForHeader = '/api/on_delete_header';

export async function install(client: Client, request: Request): Promise<any> {
    try {
        const service = new RelationsService(client);

        //const TablesSchemes = await service.createTablesSchemes();
        const configuration = service.createConfigurationScheme();
        await service.subscribeDeleteHeader(pnsKeyForHeader, pnsFunctionPathForHeader);
        await service.upsertRelations();
    } catch (err) {
        throw new Error(`Failed to create relations. error - ${err}`);
    }

    return { success: true, resultObject: {} };
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    try {
        const service = new RelationsService(client)
        await service.unsubscribeDeleteHeader(pnsKeyForHeader, pnsFunctionPathForHeader);
    } catch (err) {
        throw new Error(`Failed to unsubscribe from PNS. error - ${err}`);
    }
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    try {
        const service = new RelationsService(client);
        const configuration = service.createConfigurationScheme();
        await service.subscribeDeleteHeader(pnsKeyForHeader, pnsFunctionPathForHeader);
        await service.upsertRelations();
    } catch (err) {
        throw new Error(`Failed to create relations. error - ${err}`);
    }

    return { success: true, resultObject: {} };
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}
