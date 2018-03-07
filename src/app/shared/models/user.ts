export class User{
    constructor(
        public uid: string,
        public name: string,
        public email: string,
        public password: string,
        public photoURL: string,
        public provider: string,
        public providerUID: number,
        public dateCreated: string
    ){}
}