import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { PayPal, PayPalConfiguration, PayPalPaymentDetails, PayPalPayment } from '@ionic-native/paypal';
import { DatabaseProvider } from '../database/database';
import { ToastController, NavController, LoadingController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

/*
 Para a realização de pagamentos 
*/
@Injectable()
export class PaypalProvider{
  
    constructor(
      public payPal:PayPal,
      public toast:ToastController,
      public http:Http,
      public loading:LoadingController,
      public nacctrl:NavController,
      public database:DatabaseProvider) {
     

    }
  comprar(obj:any,form:any,user:any,lista:any){
    this.payPal.init({
        PayPalEnvironmentProduction: '',
        PayPalEnvironmentSandbox: 'Af1PUkCqlFVUeVZw00qfp3UjtwwJADNsQMPJgCj7emgYoJhsrUnO4JFLdpXq7td4R1CYiLa05zMsjv8f'
    }).then(() => {
      
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards: true,
        languageOrLocale: 'pt-BR',
        merchantName: 'Degra Arte Barbearia',
        merchantPrivacyPolicyURL: '',
        merchantUserAgreementURL: ''
      })).then(() => {   
        let detalhe  = new PayPalPaymentDetails(''+obj, '0.00', '0.00');
        let payment = new PayPalPayment(detalhe.subtotal, 'BRL', 'Degra Arte - Serviços', 'Serviço',detalhe);
        this.payPal.renderSinglePaymentUI(payment).then((response) => {
         // - ao Realizar Pagamento
         DatabaseProvider.setChave(true);
         this.database.inserirAgendamento(form,user,lista,this.loading);
                  this.toast.create({message:'Pagamento Realizado com Sucesso',duration:5000,position:'top'}).present();
                  DatabaseProvider.doZerarCar();
                  this.nacctrl.setRoot(HomePage);
                  
        }, () => {
          alert('Erro ao Finalizar Compra!');
        })
      }).catch(e=>alert(JSON.stringify(e)));
    })
  }
}


