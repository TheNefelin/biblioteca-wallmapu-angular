import { Component } from '@angular/core';
import { ColorComponent } from '@shared/components/color-component/color-component';
import { BannerComponent } from '@features/public/home/components/banner-component/banner-component';
import { NewsComponent } from "../../components/news-component/news-component";

@Component({
  selector: 'app-home-page',
  imports: [
    BannerComponent,
    ColorComponent,
    NewsComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {

}
