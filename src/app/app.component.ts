import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';

declare let cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pushSetup();
    });
  }

  pushSetup() {

    const options: PushOptions = {
      android: {
        senderID: '79428182183',
        vibrate: true,
        sound: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {

      if(notification.additionalData.foreground) {
        let alert = this.alertCtrl.create({
          title: notification.title,
          message: notification.message
        });
        console.log(cordova.plugins.notification.local);
        cordova.plugins.notification.local.schedule({
          title: notification.title,
          text: notification.message,
          foreground: true
      });
        alert.present();
        
      }

    });

    pushObject.on('registration').subscribe((registration: any) => {
      let alert = this.alertCtrl.create({
        title: 'Registration Successful',
        message: registration.registrationId
      });
      alert.present();
    });

    pushObject.subscribe('notify').then((data) => {
      let alert = this.alertCtrl.create({
        title: 'Subscription Successful',
        message: 'Subscribed to topic "notify".'
      });
      alert.present();
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Subscription Error',
        message: error.message
      });
      alert.present();
    });

    pushObject.on('error').subscribe((error) => {
      let alert = this.alertCtrl.create({
        title: 'Error with Push Plugin',
        message: error.message
      });
      alert.present();
    });

  }

}

