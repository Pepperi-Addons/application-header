import '@pepperi-addons/cpi-node';
import AppHeaderService from './app-headers-cpi.service';
import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD, AppHeaderClientEventResult, AppHeaderTemplate, APIAppHeaderTemplate } from '../shared';
export async function load(configuration: any) {
     /***********************************************************************************************/
    //                              Client Events for survey
    /************************************************************************************************/

    // Handle on survey load
    pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD as any, {}, async (data): Promise<APIAppHeaderTemplate> => {
        const service = new AppHeaderService();
        // look for header UUID if null will return default header

        const headerUUID = data?.uuid || null; 
        let appHeader:  APIAppHeaderTemplate = await service.getHeaderData(data.client, headerUUID);

        return appHeader;
    });
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})