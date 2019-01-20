import {Agendamento} from './agendamento';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AgendamentoDao } from './agendamento-dao';

@Injectable()
export class AgendamentoService {

    constructor(private _http: Http, private _storage: Storage, private _dao: AgendamentoDao){}
    
    agenda(agendamento: Agendamento) {
        
        return this._dao.ehDuplicado(agendamento)
            .then(existe => {
                if(existe) throw new Error("Esse agendamento já foi realizado.");
        })
        
    }
    
    

    
}