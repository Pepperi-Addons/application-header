import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { AppHeaderTemplate, DRAFTS_HEADERS_TABLE_NAME, PUBLISHED_HEADERS_TABLE_NAME, APIHeaderButton, APIMenuItem, MenuItemType , SyncStatus, APIAppHeaderTemplate, Icon, Badge, SYNC_BUTTIN_KEY } from 'shared';
import { AddonUUID } from '../addon.config.json';
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
    isDefaultHeader(headerUUID):boolean {
        // default header is true when there is no mapping. 
        return headerUUID !== '' ? false : true;
    }

    translateMenuItemsToAPImenuItems(menuItems){
        
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
        const isDefaultHeader = header === undefined;
        buttons = [
                new APIHeaderButton('Settings', 'Settings', new Icon('system','settings'), true, true, null),
                new APIHeaderButton('Systemavatar', 'SystemAvatar', new Icon('system','avatar'), true, true, null),
                new APIHeaderButton('Support', 'Support', new Icon('system','question'), true, true, null),
                new APIHeaderButton('Announcekit', 'Announcekit', new Icon('system','megaphone'), true, true, null)  
        ]

        if(!isDefaultHeader){
            // take custom menu and buttons from the app Header.

            header.Buttons.forEach(btn => {
                buttons.push(new APIHeaderButton(btn.Key, btn.Type, btn.Icon || '',btn.Visible, true));
            });

            menuItems = this.translateMenuItemsToAPImenuItems(header.Menu);
        }

        // Get the theme object from theme addon api (on the CPI side).
        const themeAddonUUID = '95501678-6687-4fb3-92ab-1155f47f839e';
        
        const themePromises: Promise<any>[] = [];

        // Get the app headers tab object
        themePromises.push(
            pepperi.addons.api.uuid(themeAddonUUID).get({
                // url: `/addon-cpi/themes/${AddonUUID}`,
                url: `/addon-cpi/themes/ApplicationHeader`,
                context: context
            })
        );

        // Get the profiles
        // const profiles = await this.papiClient.profiles.find();
        themePromises.push(
            pepperi.addons.api.uuid(themeAddonUUID).get({
                // url: `/addon-cpi/themes/themes`,
                url: `/addon-cpi/themes/branding`,
                context: context
            })
        );

        // wait for results and return them as object.
        const themeArr = await Promise.all(themePromises).then(res => res);

        const theme = themeArr[0];
        const themeVariables = themeArr[1];
        // Set the default values for the logo's if needed.
        const logoKey = 'logoSrc';
        const faviconKey = 'faviconSrc';

        if (!themeVariables.hasOwnProperty(logoKey)) {
            themeVariables[logoKey] = '/assets/images/Pepperi-Logo-HiRes.png'; 
        }
            
        if (!themeVariables.hasOwnProperty(faviconKey)) {
            themeVariables[faviconKey] = '/assets/favicon.ico';
        }

        let mergedTheme = {
            'BottomBorder': {
                'Opacity': theme.bottomBorder.opacity || 1,
                'Use': theme.bottomBorder.use || false,
                'Value': theme.bottomBorder.value || 'system'
            },
            'Color': {
                'ColorName': theme?.color?.color || 'system_invert',
                'ColorValue': "rgba(.....", // TODO
                'Style': theme?.color?.style || 'weak'
            },
            'Shadow': {
                'Intensity': theme?.shadow?.intensity || 'hard',
                'Size': theme?.shadow?.size || 'md',
                'Use': theme.shadow.use || false,
            },
            'FaviconURL': themeVariables[faviconKey],
            'BrandingLogoURL': themeVariables[logoKey]
        }
        mergedTheme = isDefaultHeader? await this.convertForMobileDefault(mergedTheme): mergedTheme
        
        return {
            SyncButtonData:  await this.getSyncButtonData(context!),
            
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
            
            Theme: mergedTheme
        }
    }
    async convertForMobileDefault(themes): Promise<any> {
        const isWebApp = await pepperi.environment.isWebApp
        if (!isWebApp) {
            // set transparent color for mobile
            themes.Color.ColorValue = 'rgba(0,0,0,0)'
            // set empty logo image
            themes.BrandingLogoURL = ''
        }
        return themes
    }

    async getSyncButtonData(context: IContext): Promise<any> {
        const stateInfo = await pepperi.application.sync.stateInfo();
        const obj = {
            SyncButtonData: {    
                // When the button is pressed use this key in the
                // OnClientAppHeaderButtonClicked
                ButtonKey: SYNC_BUTTIN_KEY,
                
                // Whether to show the button
                Visible: true,
        
                // the number of changed objects not synced
                // When this is > 0 the client will draw the 
                // indciation on the button
                ChangeObjects: this.getChangedObject(stateInfo.status),
                

                SyncStatus: stateInfo.status,
            },
        }
        return obj;
    }


    async getSyncStatus(client: IClient): Promise<string> {
        const stateInfo = await pepperi.application.sync.stateInfo();
        return stateInfo.status
    }
  
    getChangedObject(status: string): number {
        if (status === "HasChanges") {
            return 1;
        } else {
            return 0;
        }
    }
}
export default AppHeaderService;