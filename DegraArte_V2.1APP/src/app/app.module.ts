import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, ToastController, Nav } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AgendamentosPage} from '../pages/agendamentos/agendamentos';
import { PerfilPage } from '../pages/perfil/perfil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AgendamentoService } from '../domain/agendamento/agendamento-service';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { PayPal} from '@ionic-native/paypal';
import { DatePicker } from '@ionic-native/date-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TelaimgPage } from '../pages/telaimg/telaimg';
import { QuemsomosPage } from '../pages/quemsomos/quemsomos';
import { DatabaseProvider } from '../providers/database/database';
import { CurrencyPipe } from '@angular/common';
import { PaypalProvider } from '../providers/paypal/paypal';
import { GooglePlus } from '@ionic-native/google-plus';
import { Network } from '@ionic-native/network';
import { AgendamentoDatabaseProvider } from '../providers/agendamento-database/agendamento-database';
import { FacebookLoginProvider } from '../providers/facebook-login/facebook-login';
import { LoginPage } from '../pages/login/login';
import { Facebook } from '@ionic-native/facebook';
import { UsuarioDatabaseProvider } from '../providers/usuario-database/usuario-database';
import { RegistrarPage } from '../pages/registrar/registrar';
import { GoogleLoginProvider } from '../providers/google-login/google-login';
import { UsuarioDegraProvider } from '../providers/usuario-degra/usuario-degra';
import { MeusAgendamentosPage } from '../pages/meus-agendamentos/meus-agendamentos';
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { AdicionarTelefonePage } from '../pages/adicionar-telefone/adicionar-telefone';
import { UsuarioExternoProvider } from '../providers/usuario-externo/usuario-externo';


function provideStorage() {
  return new Storage({
    name: 'degra-arte',
    storeName: 'agendamentos'
  });
}

@NgModule({
  declarations: [
    MyApp,
    TelaimgPage,
    HomePage,
    QuemsomosPage,
    AgendamentosPage,
    PerfilPage,
    LoginPage,
    RegistrarPage,
    RecuperarSenhaPage,
    AdicionarTelefonePage,
    MeusAgendamentosPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TelaimgPage,
    HomePage,
    QuemsomosPage,
    AgendamentosPage,
    PerfilPage,
    LoginPage,
    RegistrarPage,
    MeusAgendamentosPage,
    RecuperarSenhaPage,
    AdicionarTelefonePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AgendamentoService,
    { provide: Storage, useFactory: provideStorage },
    Vibration,
    PayPal,
    CurrencyPipe,
    DatePicker,
    Network,
    SplashScreen,
    GooglePlus,
    StatusBar,
    ToastController,
    PaypalProvider,
    DatabaseProvider,
    Facebook,
    AgendamentoDatabaseProvider,
    FacebookLoginProvider,
    UsuarioDatabaseProvider,
    GoogleLoginProvider,
    UsuarioDegraProvider,
    UsuarioExternoProvider,
    Nav
  ]
})
export class AppModule {}
