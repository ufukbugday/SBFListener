import { SocketMessageType } from './../models/socket/socket-message-type.model';
import { StorageService } from './storage.service';
import { SocketMessage } from 'src/app/models/socket/socket-message.model';
import { Injectable } from "@angular/core";
import { Observable, Subject, map, Observer } from 'rxjs';
import { environment } from "src/environments/environment";
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
export const WS_ENDPOINT = environment.WS_CONNECTION;

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<SocketMessage>;

  constructor(private storageService: StorageService, private router: Router) {
    const token = this.storageService.getToken();
    this.messages = <Subject<SocketMessage>>this.connect(`${WS_ENDPOINT}/?${token}`).pipe(
      map(
        (response: MessageEvent): SocketMessage => {
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    console.log('state create ', ws.readyState);

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer: any = {
      error: null,
      complete: null,
      next: (data: SocketMessage) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
        if (ws.readyState !== WebSocket.OPEN) {
          if (data.messageType == SocketMessageType.LogOff) {
            this.router.navigateByUrl("/");
            this.storageService.clean();
          }
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
