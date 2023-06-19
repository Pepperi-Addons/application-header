import '@pepperi-addons/cpi-node'
import { Client, IClient } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import fs from 'fs';
export async function load(configuration: any) {

    pepperi.events.intercept('Application_Header', {}, async (context, next, main) => {
        debugger
        const slugs = await pepperi.slugs.getPage('/application_header');
        console.log(slugs);
    })
    
    pepperi.events.intercept('Event1', {}, async (context, next, main) => {
        debugger
        debugger
        const res = (await pepperi.events.emit('Event2', {}, context)).data;
        debugger
        // conver properties to an array
        const event2Promises = Object.keys(res).map(key => res[key]);
        const event2PromiseResult = await Promise.all(event2Promises);
        return {
            Event1Result: event2PromiseResult
        }
    })
    pepperi.events.intercept('Event2', {}, async (context, next, main) => {
        debugger
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('foo');
            }, 1000);
        });
        return {
            Event2Promise1: promise
        }
        
    })
    pepperi.events.intercept('Event2', {}, async (context, next, main) => {
        debugger
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('bar');
            }, 1000);
        });
        return {
            Event2Promise2: promise
        }
        
    })
    pepperi.events.intercept('OnClientAppHeaderLoad', {}, async (context, next, main) => {
        debugger
        return JSON.parse(await getConfigurationsHardcoded(context.client!))
    })
    

    pepperi.events.intercept('OnClientAppHeaderButtonClicked', {
        Key: 'ItemPressed'
    }, async (context, next, main) => {
        await context.client?.alert('Title', 'Item Pressed');
    })
    
    pepperi.events.intercept('OnClientAppHeaderButtonClicked', {
        Key: 'my_notification_button'
    }, async (context, next, main) => {
        return JSON.parse(await getConfigurationsHardcoded(context.client!))
    })

    
    pepperi.events.intercept('OnClientAppHeaderButtonClicked', {
        ButtonKey: 'my_settings_button'
    }, async (context, next, main) => {
        await context.client?.navigateTo({ url: '/settings/home' });
    })
    
    pepperi.events.intercept('OnClientAppHeaderButtonClicked', {
        ButtonKey: 'my_sync_button'
    }, 
    async (context, next, main) => {
        // perform sync
        sync(context.client!)
        // wait for a bit to allow sync to start
        await new Promise(resolve => setTimeout(resolve, 100));
        return JSON.parse(await getConfigurationsHardcoded(context.client!))
    })    

}
enum HeaderSyncStatus {
    InProgress = "InProgress",
    Error = "Error",
    Success = "Success",
    HasChanges = "HasChanges",

}
/*
 HasChanges: 0,
    Processing: 1,
    UpToDate: 2,
    Aborted: 3,
*/
async function getBackgroundColor(client: IClient) {
    const syncStatus = await getSyncStatus(client);
    if (syncStatus === HeaderSyncStatus.InProgress) {
        return BackgroundColor.Pink;
    } else {
        return BackgroundColor.Green;
    }
    
}
async function getChangedObject(client: IClient): Promise<number> {
    const syncStatus = await getSyncStatus(client);
    if (syncStatus === HeaderSyncStatus.HasChanges) {
        return 1;
    } else {
        return 0;
    }
}
async function getSyncStatus(client: IClient,) {
    const syncStatus = await client["syncStatus"]();
    let status = ""
    switch (syncStatus) {
        case 0:
            status = HeaderSyncStatus.HasChanges;
            break;
        case 1:
            status = HeaderSyncStatus.InProgress;
            break;
        case 2:
            status = HeaderSyncStatus.Success;
            break;
        case 3:
            status = HeaderSyncStatus.Error;
            break;
        default:
            status = HeaderSyncStatus.Success;
            break;
    }
    return status;    
}

async function sync(client: IClient) {
    const syncOptions = {    
        "allowContinueInBackground": false,
        "abortExisting": true,
    };
    return await client["sync"](syncOptions);
}
function getImageBase64() {
    return "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC";
}
async function getImagePath() {
    const dit = await pepperi.files.rootDir();
    const fileContent = getImageBase64();
    const filePath = `${dit}/test/logo.png`;
    // create folder if not exists
    await fs.promises.mkdir(`${dit}/test`, { recursive: true });
    // create a file in the root directory with the image using fs
    await fs.promises.writeFile(`${filePath}`, fileContent, 'base64');
    return `${filePath}`;
}

enum BackgroundColor {
    White = "#FFFFFF",
    Pink = "#FFC0CB",
    Green = "#00FF00",
}
async function isNotificationEnabled(): Promise<boolean> {
    let res = false;
    const page = await pepperi.slugs.getPage("/notifications");
    if (page.success) {
        res = true;
    }
    return res;
}
async function getConfigurationsHardcoded(client: IClient) {   

    const configuration = {
        "LogoPath": await getImagePath(),
        "BackgroundColor": await getBackgroundColor(client),
        "SyncButtonData": {
    
            // When the button is pressed use this key in the
            // OnClientAppHeaderButtonClicked
            "ButtonKey": "my_sync_button",
            
            // Whether to show the button
            "Visible": true,
    
            // the number of changed objects not synced
            // When this is > 0 the client will draw the 
            // indciation on the button
            "ChangeObjects": await getChangedObject(client),
            
            // In Progess the client spins the icon
            // Error??
            "SyncStatus": await getSyncStatus(client) //"Success", //getSyncStatus(client)
        },
        
        "SettingsButtonData": {
            // When the button is pressed use this key in the
            // OnClientAppHeaderButtonClicked
            "ButtonKey": "my_settings_button",
            
            // Whether to show the button
            "Visible": true, //|false,
        },
        
        "Buttons": [
            {
                // When the button is pressed use this key in the
                // OnClientAppHeaderButtonClicked
                "Key": "my_notification_button",
                
                // The Button icon
                "Icon": {
                    "Type": "System",
                    "Name": "bell"
                },
                
                "Badge": {
                    "Visible": true,//false,
                    "Title": ""
                },
                
                // Whether to show the button
                "Visible": await isNotificationEnabled(), //|false,
                
                
                "Enabled": await isNotificationEnabled(), //|false,
            }
        ],
        
        "MenuButtonData": {
            // Whether to show the button
            "Visible": true, //|false,
    
            "Header": {
                // Whether to show the button
                "Visible": true, //|false,
                
                // usually will be last sync time
                "Title": "last Sync Date Time",
            },
            
            "Items": [
                {
                    "Key": "ItemPressed",
                    "Type": "Button",
                    "Title": "First Item",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                },
                {
                    "Type": "Button",
                    "Title": "Group A (no items)",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                },
                {
                    "Type": "Seperator",
                    "Title": "",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                },
                {
                    "Type": "Group",
                    "Title": "Group B",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                    "Items" : [
                        {
                            "Type": "Button",
                            "Title": "item B1",
                            "Visible": true, //|false,
                            "Enabled": true, //|false,
                            "Key": "ItemPressed",
                        },
                        {
                            "Type": "Group",
                            "Title": "Group B2",
                            "Visible": true, //|false,
                            "Enabled": true, //|false,
                            "Items" : [
                                {
                                    "Type": "Button",
                                    "Title": "item B2.1",
                                    "Visible": true, //|false,
                                    "Enabled": true, //|false,
                                    "Key": "ItemPressed",
                                },
                                {
                                    "Type": "Group",
                                    "Title": "Group B2.2",
                                    "Visible": true, //|false,
                                    "Enabled": true, //|false,
                                    "Items" : [
                                        {
                                            "Type": "Button",
                                            "Title": "item B2.2.1",
                                            "Visible": true, //|false,
                                            "Enabled": true, //|false,
                                            "Key": "ItemPressed",
                                        },
                                    ]
                                }
                            ]
                        }
                        
                    ]
                }
            ]
        },
        // A action for the header component to perform
        // Optional
        "Action": {
            "Type": "OpenNotification",
            "Data": {}
        }
    }
    return JSON.stringify(configuration);

}
export const router = Router()
router.get('/test', (req, res) => {
    // do your job here

    res.json({
        resumeSync: 'World'
    })
})