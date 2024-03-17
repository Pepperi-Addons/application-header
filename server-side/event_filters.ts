import { Client, Request } from '@pepperi-addons/debug-server'
import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK } from 'shared';

export async function get_filter_by_event(client: Client, request: Request): Promise<any> {

    if (request.method === 'GET') {
        const eventString = request.query.event;
        const fields: any[] = [];

        if (eventString === CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK) {
            fields.push({
                FieldID: "ButtonKey",
                FieldType: "String",
                Title: "Button key",
            });
        }
        
        return {
            Fields: fields
        };

    } else {
        throw new Error('Method not supported')
    }
}