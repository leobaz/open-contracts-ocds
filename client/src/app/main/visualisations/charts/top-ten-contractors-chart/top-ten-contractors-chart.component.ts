import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { PageScrollConfig, PageScrollInstance, PageScrollService, EasingLogic } from 'ngx-page-scroll';

@Component({
  selector: 'app-top-ten-contractors-chart',
  templateUrl: './top-ten-contractors-chart.component.html',
  styleUrls: ['./top-ten-contractors-chart.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, display: 'block' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out'))
    ])
  ]
})
export class TopTenContractorsChartComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  @ViewChild('table') table: DatatableComponent;
  rows;
  visibilityState = 'hidden';
  clicked = false;
  button = false;
  oeName = '';
  columns = [
    { name: 'Titulli i aktivitetit të prokurimit' },
    { name: 'Data e publikimit të njoftimit për kontratë' },
    { name: 'Data e publikimit të njoftimit për dhënie të kontratës' }
  ];
  messages = {
    emptyMessage: `
    <div>
        <i class="fa fa-spinner fa-spin"></i>
        <p>Duke shfaqur kontratat</p>
    </div>
  `
  };

  constructor(public dataService: DataService, public translate: TranslateService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
    PageScrollConfig.defaultScrollOffset = 115;
    this.dataService.getTopTenContractors()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.chartt = new Chart({
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Top dhjetë kompanitë me më së shumti kontrata'
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: 'Kontratat'
            }
          },
          plotOptions: {
            series: {
              cursor: 'pointer',
              events: {
                click: e => {
                  this.visibilityState = 'shown';
                  this.clicked = true;
                  this.button = false;
                  const name = e.point.name;
                  this.oeName = e.point.name;
                  this.rows = [];
                  this.dataService.getContractsByName(name)
                    .takeUntil(this.unsubscribeAll)
                    .subscribe(data => {
                      this.rows = data;
                      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#table1');
                      this.pageScrollService.start(pageScrollInstance);
                    });
                }
              }
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{series.color}">Numri i kontratave: {point.y}</span><br/>'
          },
          series: [{
            name: 'Kontratat',
            data: res
          }]
        });
      });
  }

  toggle(event) {
    if (this.visibilityState === 'hidden') {
      this.button = false;
      this.visibilityState = 'shown';

    } else {
      event.target.html = '';
      this.visibilityState = 'hidden';
      this.button = true;
    }
  }

  ngOnInit() {
  }

}
