export class User {
      // it does not pass in the constructor pq this $ key is automatically generated in the firebase and would conflict when creating the chat

    public $key: string;
    constructor(
        public name: string,
        public username: string,
        public email: string,
        // public password: string,
        public photo: string,
        public oneSignalID: string


    ) {};

}