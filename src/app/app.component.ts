import { Component, OnInit, VERSION } from '@angular/core';
import * as Highcharts from 'highcharts';
import { webSocket } from 'rxjs/webSocket';
import { of, Subscription } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Angular-RxJsWebSocket-HighCharts';
  rate: any;
  rate$: Subscription;
  Highcharts: typeof Highcharts = Highcharts;
  chardata: any[] = [];
  dates: any[] = [];
  chartOptions: any;
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin');
  ngOnInit() {
    this.rate = this.subject
      .pipe(concatMap((item) => of(item).pipe(delay(3000))))
      .subscribe((data) => {
        let seconds = new Date().getSeconds();
        let minutes = new Date().getMinutes();
        let hours = new Date().getHours();
        let date = hours + ':' + minutes + ':' + seconds;
        this.dates.push(date);
        console.log(this.dates);
        this.rate = data;
        this.chardata.push(Number(this.rate.bitcoin));
        this.chartOptions = {
          series: [
            {
              data: this.chardata,
              name: 'bitcoin',
            },
          ],
          chart: {
            type: 'line',
            zoomType: 'x',
          },
          title: {
            text: 'linechart',
          },
          tooltip: {
            valueSuffix: '$',
          },
          xAxis: {
            categories: this.dates,
          },
        };
      });
  }
}
