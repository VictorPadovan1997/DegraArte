import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, ActionSheetController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AgendamentosPage } from '../pages/agendamentos/agendamentos'
import { TelaimgPage } from '../pages/telaimg/telaimg';
import { QuemsomosPage } from '../pages/quemsomos/quemsomos';
import { Network } from '@ionic-native/network';
import { PerfilPage } from '../pages/perfil/perfil';
import { MeusAgendamentosPage } from '../pages/meus-agendamentos/meus-agendamentos';
import { MeuAgendamentoPage } from '../pages/meu-agendamento/meu-agendamento';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = 'SliderPage';
  icon: string;
  public paginas = [
    {titulo:'Meus Agendamentos',icon:'list-box',componente:MeusAgendamentosPage},
    { titulo: 'Carrinho', icon: 'basket', componente: AgendamentosPage },
    { titulo: 'Localização', icon: 'compass', componente: QuemsomosPage }
  ];

  @ViewChild(Nav) public nav: Nav;
  private msg = this.load.create({ content: 'Verificando Conexão...', duration: 10000 });
  private chave = true;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public load: LoadingController,
    public network: Network,
    public actionshell: ActionSheetController,
    public splashscreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      let time;
     this.network.onDisconnect().subscribe(() => {
        this.chave = false;
        time = setInterval(() => {
          this.conexao().dismiss();
          if (this.chave) {
            clearInterval(time);
            this.msg.dismiss();
          } else {
            this.msg.dismiss();
            this.conexao().present();

          }
        }, 10000);
      });
      this.network.onConnect().subscribe(() => {
        this.chave = true;
        this.msg.dismissAll();
        clearInterval(time)
      });
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashscreen.hide();
    });
  }

  abrirPerfil(){
    this.nav.push(PerfilPage);
  }
  abrePagina(pagina) {
    this.nav.push(pagina.componente);
  }
  abrePaginaReal() {
    this.nav.push(TelaimgPage,{'chave':true});
     }
  abrePaginaServ() {
    this.nav.push(TelaimgPage,{'chave':false});
     }
  private conexao() {
   return  this.actionshell.create({
      subTitle: 'Sem Conexão com a Internet!',
      buttons: [{
        text: 'Tentar Novamente',
        handler: () => {
          this.msg.present();
        }
      }, {
        text: 'Sair',
        handler: () => {
          this.platform.exitApp();
        }
      }]
    });
  }
}

