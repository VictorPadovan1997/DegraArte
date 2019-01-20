import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, LoadingController, ActionSheetController, ToastController,  NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';

/**
 * Meus Agendamento
 */
@IonicPage()
@Component({
  selector: 'page-meus-agendamentos',
  templateUrl: 'meus-agendamentos.html',
})
export class MeusAgendamentosPage {
  private minhaAgenda=[];
  private  database = new DatabaseProvider(this.http,this.toast,this.storage);
  constructor(
    public http:Http,
    public nav:NavController,
    public navParams: NavParams,
    public storage:Storage,
    public loading:LoadingController,
    public toast:ToastController,
    public actrlSheet:ActionSheetController) {
  }

  ionViewDidLoad() {    
    this.Agendamentos();
  }

  private Agendamentos(){
        this.database.meusAgendamentos().then(data=>{
          if(data.n != '0'){

      this.minhaAgenda = (data.data != null )? data.data:[];
    }else{
      this.minhaAgenda = [];
      this.toast.create({
        message:'Você não possui Agendamentos ainda!!',
        duration:3000,
        position:'botton'
      }).present();
    }
    });
  }

  private atualizarLista(){
    this.database.meusAgendamentos().then(data=>{
      if(data.n != '0'){

  this.minhaAgenda = (data.data != null )? data.data:[];
}else{
  this.minhaAgenda = [];
}
});
  }
  agendaOpcao(obj:any){
    const opcao = this.actrlSheet.create({
      title:'Opção do Agendamento',
      buttons:[{
        text:'Cancelar Agendamento',
        icon:'trash',
        handler:()=>{
          this.database.removerAgendamento(obj.age_id);
          this.atualizarLista();          
        }
      },{
        text:'Voltar',
        icon:'arrow-dropleft-circle',
        handler:()=>{       
        }
      }]
    });

    opcao.present();
  }

}
