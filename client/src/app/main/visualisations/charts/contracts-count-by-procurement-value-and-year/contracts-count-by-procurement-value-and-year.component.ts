import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { compareValues } from '../../../../utils/sortArrayByValues';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');

@Component({
  selector: 'app-contracts-count-by-procurement-value-and-year',
  templateUrl: './contracts-count-by-procurement-value-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-value-and-year.component.css']
})
export class ContractsCountByProcurementValueAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'procedure';
  years;
  colors: string[];
  year: string;
  lang: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.colors = ['#4d8691', '#5899a6',
      '#6fc0d0',
      '#63acbb',
      '#6fc0d0',
      '#7dc6d4',
      '#8bccd9'
    ];
    this.year = 'any';
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
      });
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.translate.onLangChange
      .takeUntil(this.unsubscribeAll)
      .subscribe(langObj => {
        this.lang = langObj.lang;
        this.render();
      });
    this.render();
  }
  onChange(event) {
    this.year = event.target.value;
    this.translate.onLangChange
      .takeUntil(this.unsubscribeAll)
      .subscribe(langObj => {
        this.lang = langObj.lang;
        this.render();
      });
    this.render();
  }

  render() {
    this.dataService.getContractsCountByProcurementCategoryAndYear(this.category, this.year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        let hasUndefinedData = false;
        const undefinedObj = { name: 'Të pacaktuara', y: 0 };
        const toBeRemoved = [];

        res.map((row, i) => {
          if (row.name === '') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'n/a') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'N/A') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === null) {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'openProcedure') {
            row.name = 'Procedura e hapur';
          }
          if (row.name === 'limitedProcedure') {
            row.name = 'Procedura e kufizuar';
          }
          if (row.name === 'designContest') {
            row.name = 'Konkurs projektimi';
          }
          if (row.name === 'negociatedProcedureAfterAwardNotice') {
            row.name = 'Procedura e negociuar pas publikimit të njoftimit të kontratës';
          }
          if (row.name === 'negociatedProcedureWithoutAwardNotice') {
            row.name = 'Procedura e negociuar pa publikim të njoftimit të kontratës';
          }
          if (row.name === 'quotationValueProcedure') {
            row.name = 'Procedura e kuotimit të Çmimeve';
          }
          if (row.name === 'minimalValueProcedure') {
            row.name = 'Procedura e vlerës minimale';
          }
        });

        if (hasUndefinedData) {
          res.push(undefinedObj);
          for (let i = res.length; i >= 0; i--) {
            for (const index of toBeRemoved) {
              if (index === Number(i)) {
                res.splice(index, 1);
              }
            }
          }
        }

        // Translation of data in res
        if (this.lang === 'en' || this.lang === 'sr') {
          res.map((row, i) => {
            row.name = translateVis[this.lang][row.name];
          });
        }

        res.sort(compareValues('y', 'desc'));

        let maxValue = 0;
        for (const row of res) {
          if (row.y > maxValue) {
            maxValue = row.y;
          }
        }
        this.chartt = new Chart({
          chart: {
            type: 'bar',
          },
          title: {
            text: translateVis[this.lang]['contractByProcurementProcedure']
          },
          xAxis: {
            type: 'category'
          },
          legend: {
            enabled: false
          },
          colors: this.colors,
          plotOptions: {
            bar: {
              colorByPoint: true
            }
          },
          yAxis: {
            title: {
              text: translateVis[this.lang]['contracts']
            },
            max: maxValue
          },
          series: [{
            name: translateVis[this.lang]['numberOfContracts'],
            data: res
          }]
        });
      });
  }
}
