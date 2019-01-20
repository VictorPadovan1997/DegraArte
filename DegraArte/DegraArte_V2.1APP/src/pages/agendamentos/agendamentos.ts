
import { Component} from '@angular/core';
import { NavParams, ToastController, ActionSheetController, Platform, NavController, LoadingController } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DatabaseProvider } from '../../providers/database/database';
import { PaypalProvider } from '../../providers/paypal/paypal';
import { PayPal } from '@ionic-native/paypal';
import{Storage} from '@ionic/storage';
import { UsuarioExternoProvider } from '../../providers/usuario-externo/usuario-externo';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-agendamentos',
  templateUrl: 'agendamentos.html'
})


export class AgendamentosPage {
  private usuario = {
    id:0,
    nome:'',
    email:'',
    img:'',
    telefone:'',
    login:null,
  };
  
  private  dt = new Date();
  private finalizar: boolean = false;
  private form: FormGroup;
  private fatura = 0
  private listacar = [];
  private listaPro = [];
  private database = new DatabaseProvider(this.http, this.toast,this.storage);
  private paypal = new PaypalProvider(this.paypalb, this.toast, this.http,this.loading, this.nav, this.database);
  constructor(
    public storage:Storage,
    public http: Http,
    public paypalb: PayPal,
    public nav: NavController,
    public navParams: NavParams,
    public loading:LoadingController,
    public currency: CurrencyPipe,
    public platform: Platform,
    public databaseUSE:UsuarioExternoProvider,
    private action: ActionSheetController,
    public toast: ToastController) {

    // - pegando item de retorno
    this.finalizar = this.navParams.get('retorno');
    
    //

    // - Pegando Usuario Logado
    this.getUsuario();

    // - Pegando Lista do Carrinho
    this.listacar = DatabaseProvider.getListaCarrinho();
    if (this.listacar.length == 0) {
      this.finalizar = !this.finalizar;
      this.nav.pop();
      this.showMsg('Você não possui itens no Carrinho', 4000);
    }
    // - gerando formulario
    this.form = this.gerarForm();

    // - Valor total de Fatura
    this.listacar.forEach((item) => {
      this.fatura += item.qte * item.data.ser_valor
    });

    // - Pegando lista de Profissionais
    this.database.getProfessioanl().then((data) => {
      this.listaPro = data;
    }).catch(e => this.showMsg('Erro ao Buscar Profissionais', 4000));
  }

  // - Pegando data
  getdata(): string {
    let d = new Date(this.dt),
    day = '' + d.getDate(),
    month = '' + (d.getMonth() + 1),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
  // - pegando maximo de data
  
  // - Pegando data
  getAno(): any {
    let d = new Date(this.dt);
     let year = d.getFullYear();
  return [year,(year+1)];
}
  // - Efetua Pagamentos
  comprar() {
    this.form.getRawValue().txtnome = this.usuario.nome;
    this.form.getRawValue().txtfone = this.usuario.telefone;
    console.log(this.form);    
    if ((this.form.getRawValue().txtprof != '') && (this.form.getRawValue().txtdata != '')
      && (this.form.getRawValue().txthorario != '')) {
      this.database.validaAgenda(this.form.getRawValue()).then(data => {
        if (data[0].n > 0) {
          this.showMsg('Esse Horário já foi Agendado!', 4000);
        } else {
          this.paypal.comprar(this.fatura, this.form.getRawValue(),this.usuario, this.listacar);
        }
      });
    } else {
      this.showMsg('Verifique os Campos em Brancos ou Assinalados em Vermelho!', 3000);
    }
  }

  // Tranformando moeda
  getValor(n: any = null) {
    if (n == null) {
      return this.currency.transform(this.fatura, 'USD').replace('USD', 'R$');
    } else {
      return this.currency.transform(n, 'USD').replace('USD', 'R$');
    }
  }

  // - home
  home(){
    this.nav.setRoot(HomePage);
  }
  // - Opções ao Usuario
  doOpcao(obj: any) {
    this.action.create({
      subTitle: 'Opções',
      buttons: [{
        text: 'Deletar',
        icon: this.platform.is('ios') ? 'trash' : '',
        handler: () => {
          DatabaseProvider.doRemover(obj);
        }
      }]
    }).present();
  }

  // -  Gerando Formulario
  public gerarForm() {
    return new FormBuilder().group({
      txtnome: ['', Validators.minLength(5)],
      txtfone: ['', Validators.minLength(12)],
      txtprof: ['', Validators.minLength(1)],
      txtdata: ['', Validators.minLength(10)],
      txthorario: ['', Validators.minLength(5)],
      txtfatura: ['']
    })
  }

  // - Alterando de Formulario
  alterarForm() {
    this.nav.push(AgendamentosPage, { 'retorno': !this.finalizar });
  }

  // -  Caixa de Exibição
  public showMsg(msg: string, duracao: number) {
    this.toast.create({ message: msg, duration: duracao, position: 'botton' }).present();
  }

  // - Pagamentos em Maos
  pagarMaos() {
    console.log(this.form.getRawValue()); 
    if ((this.form.getRawValue().txtprof != '') && (this.form.getRawValue().txtdata != '')
      && (this.form.getRawValue().txthorario != '')) {
      this.database.validaAgenda(this.form.getRawValue()).then(data => {
        if (data[0].n > 0) {
          this.showMsg('Esse Horário já foi Agendado!', 4000);
        } else {
          this.database.inserirAgendamento(this.form.getRawValue(),this.usuario, this.listacar,this.loading);
        }
      });
    } else {
      this.showMsg('Verifique os Campos em Brancos ou Assinalados em Vermelho!', 3000);
    }
  }

  // - Pegando Usuario
  private getUsuario(){
    this.storage.get('usuario').then(data1=>{
      this.storage.get('login').then(data2=>{
        if(data2 == 'facebook'){
          console.log('FACE -> '+JSON.stringify(data1));
          this.usuario.id = data1.id    
           this.databaseUSE.getTelefone(this.usuario.id);
          this.storage.get('telefone').then(tell=>{
            this.usuario.telefone = tell;
          }); 
          this.usuario.nome = data1.name;
          this.usuario.email = data1.email;
          this.usuario.img = data1.picture.data.url;
          this.usuario.login = true;
        }else if(data2 == 'google'){
          console.log('GOOG -> '+JSON.stringify(data1));
          this.usuario.id = data1.userId;
          this.databaseUSE.getTelefone(this.usuario.id);
          this.storage.get('telefone').then(tell=>{
            this.usuario.telefone = tell;
          }); 
          this.usuario.nome = data1.displayName;
          this.usuario.email = data1.email;
          this.usuario.img = 'https://lh3.googleusercontent.com/-VFau0ZviWus/AAAAAAAAAAI/AAAAAAAAAAA/v6eFtWPDjzo/s64-c/'+data1.id+'.jpg';
          this.usuario.login = true;
        }else{
          console.log('DEGRA -> '+JSON.stringify(data1));
          this.usuario.id = data1.usu_id;
          this.usuario.nome = data1.usu_nome;
          this.usuario.email = data1.usu_email;
          this.usuario.telefone = data1.usu_telefone;   
          this.usuario.login = false;  
        }}).catch(e=>console.log('erro ao pegar usuario '+JSON.stringify(e)))
    }).catch(e=>console.log('erro ao pegar usuario '+JSON.stringify(e)));
  }
}




