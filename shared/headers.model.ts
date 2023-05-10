import { AddonData } from "@pepperi-addons/papi-sdk";

export const PUBLISHED_HEADERS_TABLE_NAME = 'appHeaders';
export const DRAFTS_HEADERS_TABLE_NAME = 'appHeadersDrafts';
// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
export const CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD = 'OnClientAppHeaderLoad';

// **********************************************************************************************

export interface AppHeaderClientEventResult {
    AppHeaderView: AppHeaderTemplate | null;
    Success: boolean;
}

export interface AppHeaderTemplate extends AddonData {
    Name: string;
    Description?: string;
    Hidden: boolean;
    Menu?: any// TODO - CHANGE TO MENU OBJECT ARRAY
    Buttons?: any // TODO - CHANGE TO BUTTONS OBJECT ARRAY
}

export interface HeaderTemplateRowProjection {
    Key?: string,
    Name?: string,
    Description?: string,
    Hidden: boolean,
    Draft: boolean
    Published: boolean,
    ModificationDate?: string
}

// export interface APIAppHeaderTemplate extends AddonData {
//     Name: string;
//     Description?: string;
//     Hidden: boolean;
//     Menu?: any;
//     Buttons?: any;
// }
export class APIAppHeaderTemplate  {
    SyncButtonData: Object;
    SettingsButtonData: Object;
    Buttons: Array<APIHeaderButton>;
    MenuButtonData: Object;
    Action: Object;

    constructor(buttons = [], menus = []){
        this.SyncButtonData = {};
        this.SettingsButtonData = {};
        this.Buttons = buttons;
        this.MenuButtonData = menus;
        this.Action = {}
    }
}

export class Badge {
    Visible: boolean;
    Title: string;

    constructor(visible:boolean = false,title: string = '') {
        this.Visible = visible;
        this.Title = title;
    }
}

export class Icon {
    Type: string;
    Name: string;

    constructor(type: string = '', name: string = ''){
        this.Type = type;
        this.Name = name;
    }
}

export class APIHeaderButton{
    Key: string;
    Icon: Icon;
    Visible: boolean;
    Enable: boolean;
    Badge?: Badge;

    constructor(key = '',icon = new Icon('',''), visible = true, enable = true, badge = null){
        this.Key = key;
        this.Icon = icon || new Icon;
        this.Visible = visible;
        this.Enable = enable;
        this.Badge = badge || new Badge();
    }
}

export type ButtonType = 'Button' | 'Seperator';
export type SyncStatus =  "InProgress"|"Error"|"Success";

export class APIMenuItem{
    Key: string;
    Type: ButtonType;
    Title: string;
    Visible: boolean;
    Enable: boolean;
    Items?: Array<APIMenuItem>

    constructor(key = '',type: ButtonType = 'Button',title = '', visible = true, enable = true, items: Array<APIMenuItem> = []){
        this.Key = key;
        this.Type = type;
        this.Title = title;
        this.Visible = visible;
        this.Enable = enable;
        this.Items = items;
    }
}