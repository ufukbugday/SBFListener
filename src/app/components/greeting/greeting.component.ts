import { Subject } from 'rxjs/internal/Subject';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { SocketMessage } from 'src/app/models/socket/socket-message.model';
import { SocketMessageType } from 'src/app/models/socket/socket-message-type.model';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})

export class GreetingComponent implements OnInit {
  htmlData: any = ''
  content = '';
  received: SocketMessage[] = [];
  sent: SocketMessage[] = [];
  subject: WebSocketSubject<any>; 
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private loginSevice: LoginService, private storageService: StorageService, private webSocketService: WebsocketService) {
    webSocketService.messages.subscribe(msg => {
      this.received.push(msg);
      console.log("Response from websocket: " + msg);
    });
  }

  ngOnInit(): void {
    this.loginSevice.getGreeting().subscribe(response => {
      this.htmlData = response.data;
    });
  }

  ngAfterViewInit(){
    const token = this.storageService.getToken();
    this.webSocketService.connect(token);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  socketMessageTypeTest(messageType: SocketMessageType) {

    let message: SocketMessage = {
      messageType: messageType,
      timestamp: new Date()
    };

    this.sent.push(message);
    this.webSocketService.messages.next(message);
  }
}
