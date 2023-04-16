import '@pepperi-addons/cpi-node'

export async function load(configuration: any) {
    pepperi.events.intercept('OnClientAppHeaderLoad', {}, async (data, next, main) => {
        return getConfigurationsHardcoded();
    })
    

}
function getConfigurationsHardcoded() {
    const configuration = {
        "LogoPath": "path_to_logo_in_device",
        "BackgroundColour": "#FFFFFF",
        "SyncButtonData": {
    
            // When the button is pressed use this key in the
            // OnClientAppHeaderButtonClicked
            "ButtonKey": "my_sync_button",
            
            // Whether to show the button
            "Visible": true,
    
            // the number of changed objects not synced
            // When this is > 0 the client will draw the 
            // indciation on the button
            "ChangeObjects": 3,
            
            // In Progess the client spins the icon
            // Error??
            // "SyncStatus": "InProgress"|"Error"|"Success"
        },
        
        "SettingsButtonData": {
            // When the button is pressed use this key in the
            // OnClientAppHeaderButtonClicked
            "ButtonKey": "my_settings_button",
            
            // Whether to show the button
            "Visible": true, //|false,
        },
        
        "HeaderButtons": [
            {
                // When the button is pressed use this key in the
                // OnClientAppHeaderButtonClicked
                "Key": "",
                
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
                "Visible": true, //|false,
                
                
                "Enabled": true, //|false,
            }
        ],
        
        "MenuButtonData": {
            // Whether to show the button
            "Visible": true, //|false,
    
            "Header": {
                // Whether to show the button
                "Visible": true, //|false,
                
                // usually will be last sync time
                "Title": ""
            },
            
            "Items": [
                {
                    "Key": "",
                    "Type": "Button",
                    "Title": "Hello",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                },
                {
                    "Type": "Seperator",
                    "Title": "Hello",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                },
                {
                    "Type": "Group A",
                    "Title": "Halo",
                    "Visible": true, //|false,
                    "Enabled": true, //|false,
                    "Items" : [
                        {
                            "Type": "Button",
                            "Title": "Hello",
                            "Visible": true, //|false,
                            "Enabled": true, //|false,
                        },
                        {
                            "Type": "Group B",
                            "Title": "Halo",
                            "Visible": true, //|false,
                            "Enabled": true, //|false,
                            "Items" : [
                                {
                                    "Type": "Button",
                                    "Title": "Hello",
                                    "Visible": true, //|false,
                                    "Enabled": true, //|false,
                                },
                                {
                                    "Type": "Group C",
                                    "Title": "",
                                    "Visible": true, //|false,
                                    "Enabled": true, //|false,
                                    "Items" : [
                                        {
                                            "Type": "Button",
                                            "Title": "Hello",
                                            "Visible": true, //|false,
                                            "Enabled": true, //|false,
                                        },
                                    ]
                                }
                            ]
                        }
                        
                    ]
                }
            ]
        }
    }
}
export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})