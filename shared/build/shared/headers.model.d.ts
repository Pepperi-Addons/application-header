import { AddonData } from "@pepperi-addons/papi-sdk";
export declare const PUBLISHED_HEADERS_TABLE_NAME = "appHeaders";
export declare const DRAFTS_HEADERS_TABLE_NAME = "appHeadersDrafts";
export declare const CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD = "OnClientAppHeaderLoad";
export interface AppHeaderClientEventResult {
    AppHeaderView: AppHeaderTemplate | null;
    Success: boolean;
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
    SettingsButtonData: Object;
    Buttons: Array<APIHeaderButton>;
    MenuButtonData: Object;
    Action: Object;
    Theme: any;
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
export declare class APIHeaderButton {
    Key: string;
    Icon: Icon;
    Visible: boolean;
    Enable: boolean;
    Badge?: Badge;
    constructor(key?: string, icon?: Icon, visible?: boolean, enable?: boolean, badge?: null);
}
export type ButtonType = 'Button' | 'Seperator';
export type SyncStatus = "InProgress" | "Error" | "Success";
export declare class APIMenuItem {
    Key: string;
    Type: ButtonType;
    Title: string;
    Visible: boolean;
    Enable: boolean;
    Items?: Array<APIMenuItem>;
    constructor(key?: string, type?: ButtonType, title?: string, visible?: boolean, enable?: boolean, items?: Array<APIMenuItem>);
}
