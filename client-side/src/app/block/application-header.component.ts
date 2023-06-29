import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeneralComponent } from '../components/general/general.component';
import { Button, GeneralData, HeaderData, MenuItem } from '../components/application-header.model';
import { NavigationService } from '../services/navigation.service';
import { AppHeadersService } from '../services/headers.service';
import { ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';

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
            if(this.headerData.Menu?.length){
                this.setMenuView(this.headerData.Menu);
                this.setMenuItemsObj();
            }
            // if(this.headerData?.buttons?.length){
            //     this.removeSystemButtons()
            // }

            this.generalData = { name: this.headerData.Name || '' , description: this.headerData.Description || '' };
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

    async saveHeader(event, isPublish: boolean = false){
 
        //check if click on save or publish
        this.headerData.Published = isPublish;
        
        this.headerData.Menu = this.setMenuItemsObj();
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

    onAddNewMenuItem(menuItem,isSubMenu){
       
        // check if comes from click on menu item or from ad new item button on the header
        const hierachy = isSubMenu && menuItem ? (menuItem.HierarchyLevel + 1) : 0;

        const item = new MenuItem('', hierachy,uuid(),null,true,true,[]); 
        //const index = menuItem == null ? this.menuView?.length : menuItem.ID + 1;
        const index = menuItem == null ? (this.menuView?.length || 0) : (this.menuView.findIndex(i => i.Key == menuItem.Key) + 1);
        
        this.menuView.splice(index, 0, item);

        // update also menu items object 
        if(isSubMenu){
            menuItem.Items.push(item);
        }
       
    }

    deleteMenuItem(menuItem){
        const index = this.menuView.findIndex(function(mItem) {
            return mItem.Key == menuItem.Key;
        });

        // check if has parent --> need to update the parent Items (childs) array.
        if(menuItem.HierarchyLevel > 0){
            const parent = this.menuView[index-1];
            const childIndex = parent.Items?.findIndex(function(cItem) {
                return cItem.Key == menuItem.Key;
            });
            parent.Items?.splice(childIndex, 1);
        }
        this.menuView.splice(index,1);
    }

    setMenuItemsPosition(menuItems: Array<MenuItem>){
        this.menuView = menuItems;
        //this.fixMenuItemsIDKeys();
    }

    async onMenuItemChange(menuItem){
        try{
            // get flow name and display it to menu button
            const res = await this.appHeadersService.getFlowNameByFlowKey(menuItem.Flow.FlowKey);
            menuItem.Flow.FlowName = res.Name || this.translate.instant("MENU.ACTION.CHOOSE_FLOW");
        }
        catch(err){
            menuItem.Flow.FlowName = this.translate.instant("MENU.ACTION.CHOOSE_FLOW");
        }
        finally{
            this.menuView[menuItem.ID] = menuItem;
        }
    }

    onHeaderKeyChange(key,event: any){
        if(key === 'general'){
            this.headerData.Name = event.Name || event.name || '';
            this.headerData.Description = event.Description || event.description || '';
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
