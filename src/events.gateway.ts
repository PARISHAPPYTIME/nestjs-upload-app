import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';

let num = 0;

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(client: any, payload: any): Observable<WsResponse<any>> | any {
    const { name, message, type, data } = payload;
    switch (type) {
      case 'someOneUploadFile':
        console.log(`${name}：上传了文件，准备提醒其他用户`);
        client.broadcast.emit('someOneUploadFile', data);
        break;
      default:
        console.log(`${name}：${message}`);
        break;
    }
    return of(payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): Observable<WsResponse<any>> {
    num++;
    const { name, message } = payload;
    console.log(`${name}: ${message}`, `目前房间内还剩下${num}人`);
    client.on('disconnect', () => {
      num--;
      console.log(`${name}: 离开房间`, `目前房间内还剩下${num}人`);
    });
    return of({ event: 'message', data: '欢迎使用 yxswy 软件应用' });
  }
}
