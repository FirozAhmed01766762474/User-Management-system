export class User{
    constructor(
        public email:string,
        public id:string,
        private _token:string,
        private _expiersIn:Date
    ){

    }

    get token(){
        if(!this._expiersIn || this._expiersIn < new Date()){
            return null;
        }
        return this._token;
    }
}