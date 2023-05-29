import '@pepperi-addons/cpi-node';
import AppHeaderService from './app-headers-cpi.service';
import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD, CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICKED, AppHeaderClientEventResult, AppHeaderTemplate, APIAppHeaderTemplate } from '../shared';
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

        return appHeader;
    });
    

    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICKED as any, {}, async (data): Promise<APIAppHeaderTemplate> => {
        const service = new AppHeaderService();

        // look for header UUID if null will return default header
        const slug = await pepperi.slugs.getPage('/application_header');
        const headerUUID = slug?.pageKey || ''; 

        let appHeader:  APIAppHeaderTemplate = await service.getHeaderData(data.client, headerUUID);

        switch (data.Key) {
            case "Settings":
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
                    appHeader.Action['Type'] = 'OpenSupportMenu';
                    appHeader.Action['Data']['Menu'] = [
                        {title: 'HelpSupportGuide' , url: 'https://support.pepperi.com/hc/en-us'},
                        {title: 'Community', url:'https://support.pepperi.com/hc/en-us/community/posts?sort_by=created_at'},
                        {title: 'AttendWebinar', url: 'https://www.pepperi.com/free-online-training/'}]; 
                        break;
            case 'runSript':

            default:
                const res  = await service.runScriptData(data.Key, data);
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