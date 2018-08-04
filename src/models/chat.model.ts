export class Chat {
    
    public $key: string;
     // it does not pass in the constructor pq this $ key is automatically generated in the firebase and would conflict when creating the chat
 
    constructor(
        public lastMessage: string,
        public timeStamp: any,
        public title: string,
        public photo: string,
    ) {}

}