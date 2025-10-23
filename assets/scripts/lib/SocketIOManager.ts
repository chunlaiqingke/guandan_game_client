import io from 'socket.io-client/dist/socket.io.js';
import eventLister from './eventListener';

export class SocketIOManager {

    public static instance: SocketIOManager = new SocketIOManager();

    private _socket: any;

    private eventListener = eventLister({});

    private responseMap = new Map<number, Function>();

    private callindex = 0;
    constructor() {
        // 初始化连接（替换为你的服务端地址，如 http://localhost:3000）
        this._socket = io('http://localhost:3000', {
            // 可选配置：根据服务端要求调整
            transports: ['websocket', 'polling'], // 强制使用 WebSocket（默认自动选择）
            reconnection: true, // 自动重连
            reconnectionAttempts: 5, // 最大重连次数
            reconnectionDelay: 1000, // 初始重连延迟（ms）
        });

        // 监听连接成功事件
        this._socket.on('connect', () => {
            console.log('Socket.IO 连接成功，ID:', this._socket.id);
        });

        // 监听自定义消息（例如服务端发送的 'serverMsg' 事件）
        this._socket.on('serverMsg', (data: any) => {
            console.log('收到服务端消息:', data);
        });

        // 监听断开连接事件
        this._socket.on('disconnect', (reason: string) => {
            console.log('连接断开，原因:', reason);
        });

        this._socket.on("notify",(res) =>{
            console.log("on notify cmd:" + JSON.stringify(res))
                
            if(this.responseMap.has(res.callBackIndex)){
                console.log("responseMap:" + JSON.stringify(this.responseMap))
                var callback = this.responseMap.get(res.callBackIndex)
                if(callback){
                    callback(res.result,res.data)
                }
            }else{
                console.log("else:" + JSON.stringify(this.responseMap))
                var type = res.type
                this.eventListener.fire(type, res.data)
            }

        })
    }

    _sendMsg(cmd: string, req: any, callindex) {
        this._socket.emit("notify", {cmd: cmd, data: req, callindex: callindex});
    }

    _request(cmd: string, req: any, callback: (data: any) => void) {
        this.callindex ++;
        this.responseMap.set(this.callindex, callback);
        this._sendMsg(cmd, req, this.callindex);
    }

    request_wxLogin(req: any, callback: any) {
        this._request("wxlogin", req, callback)
    }

    request_createroom(req: any, callback: any) {
        this._request("createroom_req", req, callback)
    }

    request_joinroom(req: any, callback: any) {
        this._request("joineroom_req", req, callback)
    }

    onRoomChangeState(callback: any) {
        if(callback){
            this.eventListener.on("room_state_notify",callback)
        }
    }
}