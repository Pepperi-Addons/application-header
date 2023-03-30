import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'page-block-editor',
    templateUrl: './application-header-editor.component.html',
    styleUrls: ['./application-header-editor.component.scss']
})
export class ApplicationHeaderEditorComponent implements OnInit {
    @Input() hostObject: any;

  

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {
    }


}
