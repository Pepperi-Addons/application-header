"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIMenuItem = exports.APIHeaderButton = exports.Icon = exports.Badge = exports.APIAppHeaderTemplate = exports.CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD = exports.DRAFTS_HEADERS_TABLE_NAME = exports.PUBLISHED_HEADERS_TABLE_NAME = void 0;
exports.PUBLISHED_HEADERS_TABLE_NAME = 'appHeaders';
exports.DRAFTS_HEADERS_TABLE_NAME = 'appHeadersDrafts';
// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
exports.CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD = 'OnClientAppHeaderLoad';
// export interface APIAppHeaderTemplate extends AddonData {
//     Name: string;
//     Description?: string;
//     Hidden: boolean;
//     Menu?: any;
//     Buttons?: any;
// }
class APIAppHeaderTemplate {
    constructor(buttons = [], menus = []) {
        this.SyncButtonData = {};
        this.SettingsButtonData = {};
        this.Buttons = buttons;
        this.MenuButtonData = menus;
        this.Action = {};
    }
}
exports.APIAppHeaderTemplate = APIAppHeaderTemplate;
class Badge {
    constructor(visible = false, title = '') {
        this.Visible = visible;
        this.Title = title;
    }
}
exports.Badge = Badge;
class Icon {
    constructor(type = '', name = '') {
        this.Type = type;
        this.Name = name;
    }
}
exports.Icon = Icon;
class APIHeaderButton {
    constructor(key = '', icon = new Icon('', ''), visible = true, enable = true, badge = null) {
        this.Key = key;
        this.Icon = icon || new Icon;
        this.Visible = visible;
        this.Enable = enable;
        this.Badge = badge || new Badge();
    }
}
exports.APIHeaderButton = APIHeaderButton;
class APIMenuItem {
    constructor(key = '', type = 'Button', title = '', visible = true, enable = true, items = []) {
        this.Key = key;
        this.Type = type;
        this.Title = title;
        this.Visible = visible;
        this.Enable = enable;
        this.Items = items;
    }
}
exports.APIMenuItem = APIMenuItem;
//# sourceMappingURL=headers.model.js.map