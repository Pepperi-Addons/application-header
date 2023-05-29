import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { AppHeaderTemplate, DRAFTS_HEADERS_TABLE_NAME, PUBLISHED_HEADERS_TABLE_NAME, APIHeaderButton, APIMenuItem, MenuItemType , SyncStatus, APIAppHeaderTemplate, Icon, Badge } from '../shared';
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

    public async runScriptData(scriptData, context){
        let res;
        try{
                const script = JSON.parse(Buffer.from(scriptData, 'base64').toString('utf8'));
                res = await pepperi.scripts.key(script.ScriptKey).run(script.ScriptData, context);
        }
        catch(err){
            res = {
                success: false
            }
        }

        return res;
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
            const type = item.Items?.length > 0 ? 'Group' : 'Button';
            item = new APIMenuItem(item.ID, type , item.Title, item.Visible,item.Enable, item.Items || [])
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
                new APIHeaderButton('Settings', 'Settings', new Icon('system','settings'), true, true, null),
                new APIHeaderButton('Systemavatar', 'SystemAvatar', new Icon('system','avatar'), true, true, null),
                new APIHeaderButton('Support', 'Support', new Icon('system','question'), true, true, null),
                new APIHeaderButton('Announcekit', 'Announcekit', new Icon('system','megaphone'), true, true, null)  
        ]

        if(header !== undefined){
            // take custom menu and buttons from the app Header.

            header.buttons.forEach(btn => {
                buttons.push(new APIHeaderButton(btn.Key, btn.Type, btn.Icon || '',btn.Visible, true));
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
                "Key": "syncButton",
                "Visible": true,
                "ChangeObjects": 0,
                "SyncStatus": 'Success'
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
            
            Action: {
                "Type": '',
                "Data": {}
            },
            
            Theme: theme
        }
    }
}
export default AppHeaderService;