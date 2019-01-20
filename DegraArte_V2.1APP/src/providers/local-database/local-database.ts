import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLiteOriginal, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';

/*
 / Armazenamento Offline
*/
@Injectable()
export class LocalDatabaseProvider {

  constructor(public http: Http,public sqlite:SQLiteOriginal,public toast:ToastController) {
  }

  // gerando arquivo de banco de dados
  public getBanco():any{
   return  this.sqlite.create({
      location:'default',
      name:'localbd.db'
       });
  }
  // - gerando tabelas do banco de dados
  public gerarBanco(){
    this.getBanco().then((db:SQLiteObject)=>{
            db.executeSql(
              `create table if not exists agendamento(CREATE TABLE agendamento (
                id           INTEGER ,
                cliente      TEXT (250) NOT NULL,
                data         DATE,
                hora         TIME,
                Profissional TEXT,
                status       INTEGER );
            `).then().catch(err=>{
              this.toast.create({message:'Erro ao Criar o banco de dados',position:'bottom',duration:3000}).present();
            });
    }).catch();
  }

}
