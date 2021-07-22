import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

let num = 0;

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ): Observable<WsResponse<any>> | any {
    const event = 'events';
    const response = [1, 2, 3];

    return from(response).pipe(map((data) => ({ event, data })));
    // const { name, message, type, data } = payload;
    // switch (type) {
    //   case 'someOneUploadFile':
    //     console.log(`${name}：上传了文件，准备提醒其他用户`);
    //     client.broadcast.emit('someOneUploadFile', data);
    //     break;
    //   default:
    //     console.log(`${name}：${message}`);
    //     break;
    // }
    // return of(payload);
  }

  @SubscribeMessage('someOneUploadFile')
  onUploadFile(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): Observable<WsResponse<any>> | any {
    const event = 'receive-someOneUploadFile';
    console.log('???');
    client.broadcast.emit(event, data);
    return;
  }

  @SubscribeMessage('test')
  onTest(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ): Observable<WsResponse<any>> | any {
    const event = 'receive-test';
    client.broadcast.emit(event, data);
    return;
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
