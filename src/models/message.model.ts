export class Message {
      // it does not pass in the constructor pq this $ key is automatically generated in the firebase and would conflict when creating the chat
 
    public $key: string; 
    constructor(
        public userId: string,
        public text: string,
        public timeStamp: any,
        public read: boolean
    ) {}
}