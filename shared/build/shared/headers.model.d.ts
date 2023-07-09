import { AddonData } from "@pepperi-addons/papi-sdk";
export declare const PUBLISHED_HEADERS_TABLE_NAME = "appHeaders";
export declare const DRAFTS_HEADERS_TABLE_NAME = "appHeadersDrafts";
export declare const CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD = "OnClientAppHeaderLoad";
export declare const CLIENT_ACTION_ON_CLIENT_APP_HEADER_BUTTON_CLICK = "OnClientAppHeaderButtonClick";
export declare const SYNC_BUTTIN_KEY = "SyncButtonPressed";
export interface AppHeaderClientEventResult {
    AppHeaderView: AppHeaderTemplate | null;
    Success: boolean;
}
export interface AppheaderAction {
    Type: string;
    Data: Object;
}
export interface AppHeaderTemplate extends AddonData {
    Name: string;
    Description?: string;
    Hidden: boolean;
    Menu?: any;
    Buttons?: any;
}
export interface HeaderTemplateRowProjection {
    Key?: string;
    Name?: string;
    Description?: string;
    Hidden: boolean;
    Draft: boolean;
    Published: boolean;
    ModificationDate?: string;
}
export declare class APIAppHeaderTemplate {
    SyncButtonData: Object;
    Buttons: Array<APIHeaderButton>;
    MenuButtonData: Object;
    Action: AppheaderAction;
    constructor(buttons?: never[], menus?: never[]);
}
export declare class Badge {
    Visible: boolean;
    Title: string;
    constructor(visible?: boolean, title?: string);
}
export declare class Icon {
    Type: string;
    Name: string;
    constructor(type?: string, name?: string);
}
export type MenuItemType = 'Button' | 'Group' | 'Seperator';
export type SyncStatus = "InProgress" | "Error" | "Success";
export type ButtonType = 'Notification' | 'Settings' | 'SystemAvatar' | 'Support' | 'Announcekit' | 'Regular';
export declare class APIHeaderButton {
    Key: string;
    Type: ButtonType;
    Icon: Icon;
    Visible: boolean;
    Enable: boolean;
    Badge?: Badge;
    constructor(key?: string, type?: ButtonType, icon?: Icon, visible?: boolean, enable?: boolean, badge?: null);
}
export declare class APIMenuItem {
    Key: string;
    Type: MenuItemType;
    Title: string;
    Visible: boolean;
    Enable: boolean;
    Items?: Array<APIMenuItem>;
    constructor(key?: string, type?: MenuItemType, title?: string, visible?: boolean, enable?: boolean, items?: Array<APIMenuItem>);
}
