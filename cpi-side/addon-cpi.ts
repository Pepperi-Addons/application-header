import '@pepperi-addons/cpi-node';
import AppHeaderService from './app-headers-cpi.service';
import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD, CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICKED, AppHeaderClientEventResult, AppHeaderTemplate, SYNC_BUTTIN_KEY, APIAppHeaderTemplate } from 'shared';
import { IClient } from '@pepperi-addons/cpi-node/build/cpi-side/events';

export async function load(configuration: any) {
     /***********************************************************************************************/
    //                              Client Events for survey
    /************************************************************************************************/

    // Handle on survey load
    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD as any, {}, async (data): Promise<APIAppHeaderTemplate> => {
        const service = new AppHeaderService();

        // look for header UUID if null will return default header
        const slug = await pepperi.slugs.getPage('/application_header');
        const headerUUID = slug?.pageKey || ''; 
        let appHeader:  APIAppHeaderTemplate = await service.getHeaderData(data.client, headerUUID);
        
        // default header is true when there is no mapping. 
        appHeader.DefaultHeader = headerUUID !== '' ? false : true;

        return appHeader;
    });
    /// sync button pressed
    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICKED as any, {
        ButtonKey: SYNC_BUTTIN_KEY
    }, async (data): Promise<APIAppHeaderTemplate> => {
        // start sync
        await sync(data.client!);
        // get header data
        return await getAppHeader(data.client!);

    });

    async function getAppHeader(client: IClient): Promise<APIAppHeaderTemplate> {
        const service = new AppHeaderService();
        // look for header UUID if null will return default header
        const slug = await pepperi.slugs.getPage('/application_header');
        const headerUUID = slug?.pageKey || ''; 
        const appHeader:  APIAppHeaderTemplate = await service.getHeaderData(client, headerUUID);
        return appHeader;
    }

    async function sync(client: IClient) {
        const syncOptions = {    
            "allowContinueInBackground": false,
            "abortExisting": true,
        };
        return await client["sync"](syncOptions);
    }

    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICKED as any, {}, async (data): Promise<APIAppHeaderTemplate> => { 
        let appHeader = await getAppHeader(data.client!);

        switch (data.Key) {
            case "Settings":
                appHeader.Action['Type'] = 'NavigateToSettings';
                await data.client?.navigateTo({
                    url: '/settings/home'
                });
                break;
            case "Announcekit":
                    appHeader.Action['Type'] = 'OpenAnnouncementKit';
                    break;
            case "Notification":
                    appHeader.Action['Type'] = 'OpenNotification';
                    break;
            case "Systemavatar":
                    appHeader.Action['Type'] = 'OpenUserMenu';
                    break;
            case "Support":
                    appHeader.Action['Type'] = 'OpenSupportTab';
                    await data.client?.openURI({
                        uri: 'https://support.pepperi.com/hc/en-us'
                    });
                    break;
            case 'runSript':

            default:
                const res  = await new AppHeaderService().runScriptData(data.Key, data);
                console.log(`runScriptData res: ${JSON.stringify(res)}`);
                break;
        }

        return appHeader;
    });
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})