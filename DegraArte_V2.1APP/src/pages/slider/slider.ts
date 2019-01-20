import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { HomePage } from '../home/home';

import { MenuController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs-page/tabs-page';
import { LoginPage } from '../login/login';
/**
 * Generated class for the SliderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage
  ) { }

  startApp() {
      this.navCtrl.setRoot(LoginPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    });
    this.storage.get('usuario').then(data=>{
      console.log(JSON.stringify(data));
      if(data != null){
       this.navCtrl.setRoot(HomePage);
      }
    }).catch();
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}



