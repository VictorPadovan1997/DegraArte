import { Injectable, NgModule } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { Constant } from '../../domain/constants';

/*
  // - Manipular Tabela Agendamentos
*/
@Injectable()
export class AgendamentoDatabaseProvider {
  private url = Constant.URL+'usuarioAgendamento';
  constructor(public http: Http,public toast:ToastController) {
  }

  // Pegando Agendamentos para os cliente
  public getAgendamentos(user:number):Promise<any>{
    let post = new FormData();
    post.append('usuario',''+user);
    return this.http.post(this.url+'getAgendamentos',post).map(resp=>resp.json()).toPromise().then(data=>{
      if(data.n != 0){
        return  data.agenda;
      }else{
        this.showMsg('Erro ao Solicitar Lista de Agendamentos',3000);
        return  null;
      }
    }).catch(e=>{
      this.msgErro();
      return null;})
  }

  // - Removendo Agendamento
  public removeAgendamento(age:any){
    let post = new FormData();
    post.append('age',''+age);
    this.http.post(this.url+'removerAgendamento',post).map(resp=>resp.json()).toPromise().then(data=>{
      if(data.n !=0){
        this.showMsg('Agendamento Cancelado',3000);
      }else{
        this.showMsg('Falha ao Cancelar Agendamento',3000);
      }
    }).catch(e=>this.msgErro());
  }
  
   // Show mensagem Toast
   public showMsg(msg:string,d:number) {
    this.toast.create({
      message:msg,
      duration:d,
      position:'bottom'
    }).present();
  }
 
  // - Mensagem de erro com o Servidor
  public msgErro(){
    this.showMsg('Erro na comunicação com o servidor!',3000);
  }
}
