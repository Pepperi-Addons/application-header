import '@pepperi-addons/cpi-node';
import AppHeaderService from './app-headers-cpi.service';
import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD, CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK, AppHeaderClientEventResult, AppHeaderTemplate, SYNC_BUTTIN_KEY, APIAppHeaderTemplate } from 'shared';
import { IClient } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { Relation } from '@pepperi-addons/papi-sdk';
import  config  from '../addon.config.json';

const appHeaderService =  new AppHeaderService();

export async function load(configuration: any) {

    let relation: Relation = {
        Type: "CPIAddonAPI",
        AddonRelativeURL: "/addon-cpi/after_sync_registration",
        AddonUUID: config.AddonUUID,
        RelationName: "AfterSync",
        Name: "events_after_sync_registration",
    }

    await pepperi.addons.data.relations.upsert(relation);
    
     /***********************************************************************************************/
    //                              Client Events for application header
    /************************************************************************************************/

    // Handle on application header load
    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD as any, {}, async (data): Promise<APIAppHeaderTemplate> => {
        let appHeader:  APIAppHeaderTemplate = await appHeaderService.getHeaderData(data.client);
        return appHeader;
    });

    /// sync button pressed
    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK as any, {
        ButtonKey: SYNC_BUTTIN_KEY
    }, async (data): Promise<APIAppHeaderTemplate> => {
        // start sync
        await sync(data.client!);
        // get header data
        return await appHeaderService.getSyncHeaderData(data.client!);
    });

    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK as any, {}, async (data): Promise<APIAppHeaderTemplate> => { 
        let appHeader = await getAppHeader(data.client!);
        let state = data.client?.context;
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

            default:
                //const service = new AppHeaderService();
                appHeader = await appHeaderService.getOptionsFromFlow(appHeader,data.Key,state);
                break;
        }

        return appHeader;
    });

    async function getAppHeader(client: IClient): Promise<APIAppHeaderTemplate> {
        const appHeader:  APIAppHeaderTemplate = await appHeaderService.getHeaderData(client);
        return appHeader;
    }

    async function sync(client: IClient) {
        const syncOptions = {    
            "allowContinueInBackground": true,
            "abortExisting": true,
            "showHUD": false
        };

        return await client["sync"](syncOptions);
    }
}

export const router = Router()

router.post('/after_sync_registration', async (req, res, next) => {
    appHeaderService.reloadAppHeader(req.body.client).then(header => {
        res.json({
            res: header
        });
    }).catch(next)
});
