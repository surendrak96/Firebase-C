import { Component, Input } from '@angular/core';

import { Message } from '../../models/message.model';

/* no host fica tipo assim
  <message-box [style.justify-content]="flex-start"> </message-box>
*/

@Component({
  selector: 'message-box',
  templateUrl: 'message-box.component.html',
  host: {
   // can take properties in the element and make input property (placing a style (class) conditionally)
   '[style.justify-content]': '((!isFromSender) ? "flex-start" : "flex-end")',
  // If it is NOT the sender, it is on the left, if it is, it is on the right
    // '[style.text-align]': '((!isFromSender) ? "left" : "right")'
  }
})
export class MessageBoxComponent {

  // the decorator Input allows you to pass values from the view here
; @Input() message: Message;
  @Input() isFromSender: boolean;
  @Input() alreadyRead: boolean;

  constructor() {}

}
