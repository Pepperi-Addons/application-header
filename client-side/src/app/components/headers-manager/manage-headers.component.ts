import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from "@angular/core";
import { AppHeadersService, IHeaderData } from '../../services/headers.service'; 
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepOption, PepLoaderService } from '@pepperi-addons/ngx-lib';
import { IPepButtonClickEvent } from '@pepperi-addons/ngx-lib/button';
import { MenuDataView, MenuDataViewField, Page } from '@pepperi-addons/papi-sdk';

interface IMappedHeader {
    Desc?: string;
    Name?: string;
    Key?: string;
}

@Component({
    templateUrl: './manage-headers.component.html',
    styleUrls: ['./manage-headers.component.scss']
})
export class ManageHeadersComponent implements OnInit {
    title: string = '';
    dataView: MenuDataView;
    availableHeaders: Array<IPepDraggableItem> = [];
    mappedHeaders: Array<IMappedHeader> = [];

    isFinishLoading = false;

    constructor(
        private loaderService: PepLoaderService,
        public addonService: AppHeadersService,
        public translate: TranslateService,
        public dialogService: PepDialogService,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {

    }

    private setAvailableHeaderPermission(key: string, disable: boolean) {
        // Find the item in the available headers
        const item = this.availableHeaders.find(as => as.data.key === key);
        
        // If exist disable or enable it.
        if (item) {
            item.disabled = disable;
        }
    }

    private addNewHeader(draggableItem: IPepDraggableItem, index: number) {
        this.setAvailableHeaderPermission(draggableItem.data.Key, true);
        // Add new mappedHeader to the mappedHeaders.
        const mappedHeader: IMappedHeader = { Name: draggableItem.title, Key: draggableItem.data.key, Desc: draggableItem.data.desc };
        this.mappedHeaders.splice(index, 0, mappedHeader);
    }

    private changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
    }

    private changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
    }
    
    private async loadData() {
        // Load the dataview by id and set all the mappedHeaders array.
        this.loaderService.show();
        this.mappedHeaders = [];
        const dataViewId = this.activatedRoute.snapshot.params["tabIndex"];

        await this.addonService.getHeaders().then((headers: IHeaderData[]) => {
            this.availableHeaders = headers.filter(h => h.Published === true).map(header => { 
                    return { title: header.Name, data: {key: header.Key, desc: header.Description } }
            }).sort((header1, header2) => {
                if (header1.title < header2.title) { return -1; }
                if (header1.title > header2.title) { return 1; }
                return 0;
            });
        });
 
        // const dataViews: MenuDataView[] = await this.addonService.getHeadersDataView(dataViewId);
        // if (dataViews?.length === 1) {
        //     this.dataView = dataViews[0];
           
        //     for (let index = 0; index < this.dataView.Fields?.length; index++) {
        //         const field = this.dataView.Fields[index];
        //         this.mappedHeaders.push({
        //             key: field.FieldID,
        //             name: field.Title
        //         });
        //         this.setAvailableHeaderPermission(field.FieldID, true);
        //     }
        // } else {
        //     // TODO: Show error data view is not exist.
        //     //this.goBack();
        // }

        this.isFinishLoading = true;
        this.loaderService.hide();
    }

    // private saveHeadersDataView(fields: MenuDataViewField[]) {
    //     this.dataView.Fields = fields;
    //     this.addonService.saveHeadersDataView(this.dataView).then(res => {
    //         this.dialogService.openDefaultDialog(new PepDialogData({
    //             title: this.translate.instant('MAPPING.DIALOG_INFO_TITLE'),
    //             content: this.translate.instant('MAPPING.MAPPED_HEADERS_SAVED_DIALOG_CONTENT')
    //         })).afterClosed().subscribe(value => {
    //             this.goBack();
    //         });
    //     });
    // }

    ngOnInit() {
            this.loadData(); 
    }

    goBack(tabID = 1) {
        // this.router.navigate(['..'], {
        //     relativeTo: this.activatedRoute,
        //     queryParams: { tabIndex: 1 },
        //     queryParamsHandling: 'merge'
        // });
        this.router.navigate(['../../'], {
            relativeTo: this.activatedRoute,
            queryParams: { tabIndex: tabID }, 
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
        // this.router.navigate([`../`], {
        //     relativeTo: this.activatedRoute
            
        // });
    }

    saveClicked() {

        // Save the current dataview.
        const fields: MenuDataViewField[] = [];

        for (let index = 0; index < this.mappedHeaders.length; index++) {
            const mappedHeader = this.mappedHeaders[index];
            
            // Add the mapped slug only if the page is selected.            
            if (mappedHeader.Key) {
                fields.push({
                    FieldID: mappedHeader.Key,
                    Title: mappedHeader.Name
                });
            } else {

            }
        }

        //this.saveHeadersDataView(fields);
    }

    onDragStart(event: CdkDragStart) {
        this.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.changeCursorOnDragEnd();
    }
    
    onDropHeader(event: CdkDragDrop<IPepDraggableItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else if (event.container.id === 'emptyDropArea') {
            this.addNewHeader(event.previousContainer.data[event.previousIndex], this.mappedHeaders.length);
        } else {
            this.addNewHeader(event.previousContainer.data[event.previousIndex], event.currentIndex);
        }
    }

    // onPageChanged(event: string, mappedHeader: IMappedHeader) {
    //     const index = this.mappedHeaders.findIndex( ms => ms.header === mappedHeader.header);
    //     this.mappedHeaders[index].key = event;
    // }

    onDeleteMappedHeader(event: IPepButtonClickEvent, mappedHeader: IMappedHeader) {
        const index = this.mappedHeaders.findIndex( ms => ms.Key === mappedHeader.Key);
        if (index > -1) {
            this.mappedHeaders.splice(index, 1);

            this.setAvailableHeaderPermission(mappedHeader.Key, false);
        }
    }
}
