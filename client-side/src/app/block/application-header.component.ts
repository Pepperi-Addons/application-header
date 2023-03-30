import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralComponent } from '../components/general/general.component';
import { GeneralData, HeaderData, MenuItem } from '../components/application-header.model';
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
    generalData: GeneralData = new GeneralData();
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private route: ActivatedRoute, private translate: TranslateService, private _navigationService: NavigationService, private appHeadersService: AppHeadersService ) {
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
            this.generalData = { name: this.headerData.name || '' , description: this.headerData.description || '' };
        }
    }

    async saveHeader(event, isPublish: boolean = false){
        //check if click on save or publish
        this.headerData.published = isPublish;
        const header = await this.appHeadersService.upsertHeader(this.headerData); // options
        this.navigateBack();
    }

    onAddNewMenuItem(menuItem,isSubMenu){
        // check if comes from click on menu item or from ad new item button on the header
        const hierachy = isSubMenu && menuItem ? (menuItem.HierarchyLevel + 1) : 0;
        const item = new MenuItem(this.headerData?.menu?.length || 0 , '', hierachy); 
        const index = menuItem == null ? this.headerData?.menu?.length : menuItem.ID + 1;
       
        this.headerData.menu.splice(index, 0, item);  
        //fix the ids (index of the items 0,1,2...)
        this.fixMenuItemsIDKeys();
    }

    setMenuItemsPosition(menuItems: Array<MenuItem>){
        this.headerData.menu = menuItems;
        this.fixMenuItemsIDKeys();
    }

    onMenuItemChange(menuItem){
        this.headerData.menu[menuItem.ID] = menuItem;
    }

    deleteMenuItem(menuItem){
        
        this.headerData.menu.splice(menuItem.ID,1);
        this.fixMenuItemsIDKeys();
    }

    fixMenuItemsIDKeys(){
        for(let i = 0; i < this.headerData.menu.length; i++){
            if(i === 0){
                this.headerData.menu[i].HierarchyLevel = 0;
            }
            
            this.headerData.menu[i].ID = i;
            
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
