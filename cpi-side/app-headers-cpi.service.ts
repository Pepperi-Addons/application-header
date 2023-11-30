import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { AppHeaderTemplate, PUBLISHED_HEADERS_TABLE_NAME, APIHeaderButton, APIMenuItem , APIAppHeaderTemplate, Icon, SYNC_BUTTIN_KEY } from 'shared';
import { AddonUUID } from '../addon.config.json';
import { FlowObject, RunFlowBody } from '@pepperi-addons/cpi-node';
class AppHeaderService {
    
    private headerUUID: string = '';
    private appHeader;

    constructor() {}

    /***********************************************************************************************/
    //                              Private functions
    /************************************************************************************************/
    public async reloadAppHeader(client: IClient | undefined){
        this.appHeader = null;
        this.appHeader = await this.getHeaderData(client);
        return this.appHeader;
    }

    private async getAppHeader(headerKey: string): Promise<AppHeaderTemplate> {
       let header; 
        
       try{
            //header = await pepperi.papiClient.addons.api.uuid('84c999c3-84b7-454e-9a86-71b7abc96554').file('api').func('get_by_key').get({ addonUUID: AddonUUID, scheme: 'drafts', name: 'AppHeaderConfiguration', key: headerKey });   
            //change to pepperi.addons... for offline working
            header = await pepperi.addons.configurations.get(headerKey);
        }
        catch(err){

        }   
        return header as any;
    }


    private getFlattenMenu = (members) => {
        let children:any = [];
      
        return members.map(m => {
          if (m.Items && m.Items.length) {
            children = [...children, ...m.Items];
          }
          return m;
        }).concat(children.length ? this.getFlattenMenu(children) : children);
      };

  
    public async getMenuItemFlow(btnKey){
        let res;
        
        try{
            const slug = await pepperi.slugs.getPage('/application_header');
            const headerUUID = slug?.pageKey || ''; 

            const appHeader = await new AppHeaderService().getAppHeader(headerUUID);
         
            const flatMenu = appHeader?.Data?.Menu ? this.getFlattenMenu(appHeader.Data.Menu) : null;
            if(flatMenu){
                const item = flatMenu?.filter(item => {
                    return item.Key === btnKey;
                });

                res = item?.length ? item[0].Flow : null;
            }
        }
        catch(err: any){}
        finally{
            return res;
        }
            
    }

    public async getOptionsFromFlow(appHeader, btnKey, context: IContext | undefined, configuration = {}): Promise<any> {
        
        let flowData: FlowObject = {
            FlowKey: '',
            FlowParams: {}
        }
        const flatMenu = this.getFlattenMenu(appHeader.MenuButtonData.Items);

        if(flatMenu){
            const item = flatMenu?.filter(item => {
                return item.Key === btnKey;
            });

            flowData = item?.length ? item[0].Flow : {};
        }

        if (flowData.FlowKey?.length > 0) {
            const dynamicParamsData: any = {};
            if (flowData.FlowParams) {
                const dynamicParams: any = [];
                // Get all dynamic parameters to set their value on the data property later.
                const keysArr = Object.keys(flowData.FlowParams);
                for (let index = 0; index < keysArr.length; index++) {
                    const key = keysArr[index];
                    if (flowData.FlowParams[key].Source === 'Dynamic') {
                        dynamicParams.push(flowData.FlowParams[key].Value);
                    }
                }
                // Set the dynamic parameters values on the dynamicParamsData property.
                for (let index = 0; index < dynamicParams.length; index++) {
                    const param = dynamicParams[index];
                    dynamicParamsData[param] = param === 'configuration' ? appHeader : '';
                }
            }
            const flowToRun: RunFlowBody = {
                RunFlow: flowData,
                Data: dynamicParamsData,
                context: context
            };
            // Run the flow and return the options.
            let flowRes = await pepperi.flows.run(flowToRun);
            return flowRes.configuration || appHeader;
        }
        else {
            return {};
        }
    }

    public async getSyncHeaderData(client: IClient): Promise<APIAppHeaderTemplate> {
        let header = await this.getHeaderData(client);
        header.SyncButtonData = await this.getSyncButtonData();
        return header;
}

     /***********************************************************************************************/
    //                              Public functions
    /************************************************************************************************/

    async getHeaderData(client: IClient | undefined): Promise<APIAppHeaderTemplate> {
            if(!this.appHeader){
                // look for header UUID if null will return default header
                const slug = await pepperi.slugs.getPage('/application_header');
                this.headerUUID = slug?.pageKey || ''; 
                const header = this.headerUUID?.length ? await this.getAppHeader(this.headerUUID) : undefined;
                this.appHeader = await this.translateHeaderToAPIheader(header?.Data || undefined, client?.context || undefined);
            }

            return this.appHeader;

    }

    isDefaultHeader(headerUUID):boolean {
        // default header is true when there is no mapping. 
        return headerUUID !== '' ? false : true;
    }

    translateMenuItemsToAPImenuItems(menuItems){
    
        menuItems.forEach(item => {
            // check if menuItem have subMenu (Items) and set Type to group | button
            item.Type = item.Items?.length > 0 ? 'Group' : 'Button';
            //delete the Flow from the menu items if exit. we will run it from the cpi side by button key
            //delete item.Flow;
            
            // if has children build them too
            if(item.Items?.length){
                this.translateMenuItemsToAPImenuItems(item.Items);
            }
        });

        return menuItems;
    }

    async translateHeaderToAPIheader(header: AppHeaderTemplate | undefined, context: IContext | undefined){
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
        else{
            // if default - need to check if has slug of notification --> add notification button
            const page = await pepperi.slugs.getPage("/notifications");
            if(page.success){
                buttons.push(new APIHeaderButton('Notification', 'Notification', new Icon('system','bell'), true, true, null));
            }
        }

        let mergedTheme = await this.getMergedTheme(isDefaultHeader, context);

        return {
            SyncButtonData:  await this.getSyncButtonData(),
            
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

    async getMergedTheme(isDefaultHeader, context){
        
        const isWebApp = await pepperi.environment.isWebApp();
        let mergedTheme = {};

        if(isWebApp || (!isDefaultHeader && !isWebApp)){
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
            
            // Get the branding tab
            themePromises.push(
                pepperi.addons.api.uuid(themeAddonUUID).get({
                url: `/addon-cpi/themes/branding`,
                    context: context
                })
            );
            
            try{
            // wait for results and return them as object.
            const themeArr = await Promise.all(themePromises).then(res => res);

            const theme = themeArr[0];
            const themeVariables = themeArr[1];

            // Set the default values for the logo's if needed.
            const logoKey = 'logoAssetKey';
            const faviconKey = 'faviconAssetsKey'; 

           if (themeVariables.hasOwnProperty(logoKey)) {
                const logo = await pepperi.addons.pfs.uuid("ad909780-0c23-401e-8e8e-f514cc4f6aa2").schema("Assets").key(themeVariables.logoAssetKey).get();
                themeVariables[logoKey] = logo.URL; 
           }
                
            if (themeVariables.hasOwnProperty(faviconKey)) {
                const favIcon = await pepperi.addons.pfs.uuid("ad909780-0c23-401e-8e8e-f514cc4f6aa2").schema("Assets").key(themeVariables.faviconAssetKey).get();
                themeVariables[faviconKey] = favIcon.URL;    
           }

            mergedTheme = {
                'BottomBorder': {
                    'Opacity': theme.bottomBorder.opacity || 1,
                    'Use': theme.bottomBorder.use || false,
                    'Value': theme.bottomBorder.value || 'system'
                },
                'Color': {
                    'ColorName': theme?.color?.color || 'system_invert',
                    'ColorValue': theme?.color?.colorValue || 'rgba(255,255,255,0)',
                    'Style': theme?.color?.style || 'weak'
                },
                'Shadow': {
                    'Intensity': theme?.shadow?.intensity || 'hard',
                    'Size': theme?.shadow?.size || 'md',
                    'Use': theme.shadow.use || false,
                },
                'FaviconURL': themeVariables[faviconKey] || '',
                'BrandingLogoURL': themeVariables[logoKey] || ''
            }
            }
            catch(err){
                mergedTheme = {
                    'Color': {
                        'ColorValue': 'rgba(255,255,255,0)'  // set transparent color for mobile
                    },
                    'BrandingLogoURL': '' // set empty logo image
                }
            }
        }
        else{ // only mobile with default header
            mergedTheme = {
                'Color': {
                    'ColorValue': 'rgba(255,255,255,0)'  // set transparent color for mobile
                },
                'BrandingLogoURL': '' // set empty logo image
            }
        }

        return mergedTheme;
             
    }

 

    async getSyncButtonData(): Promise<any> {
        const stateInfo = await pepperi.application.sync.stateInfo();

        const obj = {  
            // When the button is pressed use this key in the
            // OnClientAppHeaderButtonClick
            ButtonKey: SYNC_BUTTIN_KEY,
            
            // Whether to show the button
            Visible: true,
    
            // the number of changed objects not synced
            // When this is > 0 the client will draw the 
            // indciation on the button
            ChangeObjects: this.getChangedObject(stateInfo.status),
            

            SyncStatus: stateInfo.status,
          
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