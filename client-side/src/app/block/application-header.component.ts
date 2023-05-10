import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeneralComponent } from '../components/general/general.component';
import { Button, GeneralData, HeaderData, MenuItem } from '../components/application-header.model';
import { NavigationService } from '../services/navigation.service';
import { AppHeadersService } from '../services/headers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-block',
    templateUrl: './application-header.component.html',
    styleUrls: ['./application-header.component.scss'],
    providers: [GeneralComponent]
})
export class ApplicationHeaderComponent implements OnInit {
    
    headerData : HeaderData = new HeaderData();
    menuView : Array<MenuItem> = [];
    generalData: GeneralData = new GeneralData();
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private route: ActivatedRoute, private translate: TranslateService, 
                private _navigationService: NavigationService, private appHeadersService: AppHeadersService) {
    }

    async ngOnInit() {
       
        const headerKey =  this.route.snapshot.data['header_key'] || this.route?.snapshot?.params['header_key'] || '';
        let options = `where=Key="${headerKey}"`; 
        const res = (await this.appHeadersService.getHeaders(encodeURI(options)))[0] || {};
 
        this.headerData =  {
            ...this.headerData,
            ...res
        };

        if(this.headerData){
            if(this.headerData.menu?.length){
                this.setMenuView(this.headerData.menu);
                this.setMenuItemsObj();
            }
            // if(this.headerData?.buttons?.length){
            //     this.removeSystemButtons()
            // }

            this.generalData = { name: this.headerData.name || '' , description: this.headerData.description || '' };
        }

        //this.appHeadersService.loadHeader(headerKey);
    }
    
    setMenuView(menu: Array<MenuItem>){
        menu.forEach(menuItem => {
            this.menuView.push(menuItem);
            if(menuItem.Items?.length){
                this.setMenuView(menuItem.Items);
            }
        })
    }

    // removeSystemButtons(){
    //     this.headerData.buttons = this.headerData.buttons.filter(btn => {
    //         return btn.ButtonKey === 'notification';
    //     })
    // }
    async saveHeader(event, isPublish: boolean = false){
        //check if click on save or publish
        this.headerData.published = isPublish;
        
        this.headerData.menu = this.setMenuItemsObj();
        //this.headerData.buttons = this.addDefaultButtons();
  
        const header = await this.appHeadersService.upsertHeader(this.headerData); // options
        this.navigateBack();
    }

    setMenuItemsObj(index = 0, hierarchylevel = 0): Array<MenuItem> {
        let hierachyLevel = hierarchylevel;
        let menuItems: Array<MenuItem> = [];

        for(let i=index; i< this.menuView.length; i++){
            let menuItem = this.menuView[i];
            
            //checking if reached to a new menu.
            if(menuItem.HierarchyLevel < hierachyLevel){
                break; 
            }

            if(menuItem.HierarchyLevel === hierachyLevel){
                menuItems.push(menuItem);

                if(i < this.menuView.length && this.menuView[i+1]?.HierarchyLevel && this.menuView[i+1].HierarchyLevel > menuItem.HierarchyLevel){
                    let children = this.setMenuItemsObj(i+1, this.menuView[i+1].HierarchyLevel );

                    menuItems[menuItems.length-1].Items = children;
                }
            }
        }
        return menuItems;
    }

    // addDefaultButtons(){
    //     let buttons:Array<Button> = [];
    
    //     const defaultHeaderBtns = [
    //         new Button('Settings','settings',true, { Type: 'system', Name: 'settings' }, 'settings'),
    //         new Button('Support','support',true, { Type: 'system', Name: 'question' }, 'support'),
    //         new Button('Announcekit','announcekit',true, { Type: 'system', Name: 'megaphone' }, 'announcekit'),
    //         new Button('Notification','notification',true, { Type: 'system', Name: 'bell' }, 'notification'),
    //      ]

    //     return [...buttons,...defaultHeaderBtns];
    // }

    onAddNewMenuItem(menuItem,isSubMenu){
        // check if comes from click on menu item or from ad new item button on the header
        const hierachy = isSubMenu && menuItem ? (menuItem.HierarchyLevel + 1) : 0;
        const item = new MenuItem(this.menuView?.length || 0 , '', hierachy); 
        const index = menuItem == null ? this.menuView?.length : menuItem.ID + 1;
        
        this.menuView.splice(index, 0, item);
        //fix the ids (index of the items 0,1,2...)
        this.fixMenuItemsIDKeys();
    }

    setMenuItemsPosition(menuItems: Array<MenuItem>){
        this.menuView = menuItems;
        this.fixMenuItemsIDKeys();
    }

    onMenuItemChange(menuItem){
        this.menuView[menuItem.ID] = menuItem;
    }

    deleteMenuItem(menuItem){
        this.menuView.splice(menuItem.ID,1);
        this.fixMenuItemsIDKeys();
    }

    fixMenuItemsIDKeys(){
        for(let i = 0; i < this.menuView.length; i++){
            if(i === 0){
                this.menuView[i].HierarchyLevel = 0;
            }
            
            this.menuView[i].ID = i;
            
        }
    }

    onHeaderKeyChange(key,event: any){
        if(key === 'general'){
            this.headerData.name = event.name || '';
            this.headerData.description = event.description || '';
        }
        else{
            this.headerData[key] = event;
        }
       
    }

    ngOnChanges(e: any): void {

    }

    tabClick(event: any){

    }

    navigateBack(){
        this._navigationService.back();
    }
}
