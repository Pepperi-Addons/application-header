import { Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { AppHeaderTemplate, DRAFTS_HEADERS_TABLE_NAME, PUBLISHED_HEADERS_TABLE_NAME, APIHeaderButton, APIMenuItem, ButtonType , SyncStatus, APIAppHeaderTemplate, Icon, Badge } from '../shared';
import { AddonUUID } from '../addon.config.json'
class AppHeaderService {
    
    constructor() {}

    /***********************************************************************************************/
    //                              Private functions
    /************************************************************************************************/
    
    private async getAppHeader(headerKey: string): Promise<AppHeaderTemplate> {
       let header; 
        try{
              header = (await pepperi.api.adal.get({
                            addon: AddonUUID,
                            table: PUBLISHED_HEADERS_TABLE_NAME,
                            key: headerKey
                            
                        })).object;
        } 
        catch(err){

        }   
        return header as any;
    }


     /***********************************************************************************************/
    //                              Public functions
    /************************************************************************************************/

    async getHeaderData(client: IClient | undefined, headerKey: string): Promise<APIAppHeaderTemplate> {
        
        const header = await this.getAppHeader(headerKey);
        return await this.translateHeaderToAPIheader(header, client?.context || undefined);
        //return header;

    }
    translateMenuItemsToAPImenuItems(menuItems){
        
        let tempItems: Array<APIMenuItem> = [];
        menuItems.forEach(item => {
            item = new APIMenuItem(item.ID, item.Type, item.Title, item.Visible,item.Enable, item.Items || [])
            if(item.Items?.length){
                this.translateMenuItemsToAPImenuItems(item.Items);
            }
        });

        return menuItems;
       //return new APIMenuItem(menuItem.ID, menuItem.Type, menuItem.Title, menuItem.Visible,menuItem.Enable, menuItem.Items || [])
    }

    async translateHeaderToAPIheader(header: AppHeaderTemplate, context: IContext | undefined){

        const showSettingsKey = true;
        let buttons: Array<APIHeaderButton> = [];
        let menuItems: Array<APIMenuItem> = [];
   
        
        buttons = [
                new APIHeaderButton('settings', new Icon('system','settings'), true, true, null),
                new APIHeaderButton('support', new Icon('system','question'), true, true, null),
                new APIHeaderButton('announcekit', new Icon('system','megaphone'), true, true, null),
                new APIHeaderButton('systemavatar', new Icon('system','avatar'), true, true, null),
        ]

        if(header !== undefined){
            // take custom menu and buttons from the app Header.

            header.buttons.forEach(btn => {
                buttons.push(new APIHeaderButton(btn.ButtonKey, btn.Icon || '', btn.Visible, true));
            });

            menuItems = this.translateMenuItemsToAPImenuItems(header.menu);
        }

        // Get the theme object from theme addon api (on the CPI side).
        const themeAddonUUID = '95501678-6687-4fb3-92ab-1155f47f839e';
        const theme = await pepperi.addons.api.uuid(themeAddonUUID).get({
            url: `/addon-cpi/themes/${AddonUUID}`,
            context: context
        })

        return {
            SyncButtonData: {
                "ButtonKey": "syncButton",
                "Visible": true,
                "ChangeObjects": 0,
                "SyncStatus": 'Success'
            },
            
            SettingsButtonData: {
                "ButtonKey": "settingsButton",
                "Visible": showSettingsKey
            },
            
            Buttons: buttons || [],
            
            MenuButtonData: {
                "Visible": true,
                "Header": {
                    "Visible": true,
                    "Title": "Last sync: 01/5/2023 13:30"
                },
                
                Items: menuItems || []    
            },
            
            "Action": {
            
            },
            Theme: theme
        }
    }
}
export default AppHeaderService;