import { Component, OnInit} from '@angular/core';
import { NavController, LoadingController,ToastController, MenuController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Http } from '@angular/http';
import { AgendamentosPage } from '../agendamentos/agendamentos';
import{Storage} from '@ionic/storage';
import { Constant } from '../../domain/constants';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  implements OnInit{
  
  public servico = [];
  private img = Constant.URL;
  constructor(public http:Http,
    public navCtrl: NavController,
    public menuctrl:MenuController,
    private _loadingCtrl: LoadingController,public storage:Storage,
    public toast:ToastController) {}


  ngOnInit(): void {
    this.menuctrl.enable(true);
    let loading = this._loadingCtrl.create({
      content: 'Carregando Serviços...'
    });
    
    loading.present();
    let database = new DatabaseProvider(this.http,this.toast,this.storage);
    database.getServico().then(data=>{
      this.servico = data;
      loading.dismiss();
    });
    
  }
  doCarrinho(){
    this.navCtrl.push(AgendamentosPage,{});
  }

  adicionarCar(obj:any){
    this.toast.create({message:'Adicionado ao Carrinho',duration:2500,position:'botton'}).present();
    DatabaseProvider.doAdicionar(obj,1);
  }

  
}