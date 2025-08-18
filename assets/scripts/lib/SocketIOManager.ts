import io from 'socket.io-client/dist/socket.io.js';

export class SocketIOManager {

    public static instance: SocketIOManager = new SocketIOManager();

    private _socket: any;

    private eventRegister = {};

    private responseMap = {};

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
    }

    _sendMsg(cmd: string, req: any, callindex) {
        this._socket.emit("notify", {cmd: cmd, data: req, callindex: callindex});
    }

    _request(cmd: string, req: any, callback: (data: any) => void) {
        this.callindex ++;
        this.responseMap[this.callindex] = callback;
        this._sendMsg(cmd, req, this.callindex);
    }

    on(event: string, callback: (data: any) => void) {
        if (this.eventRegister.hasOwnProperty(event)) {
            this.eventRegister[event].push(callback);
        } else {
            this.eventRegister[event] = [callback];
        }
    }

    fire(event: string) {
        if (this.eventRegister.hasOwnProperty(event)) {
            var methodList = this.eventRegister[event];
            for (var i = 0; i < methodList.length; i++) {
                var handle = methodList[i];
                var args = [];
                for (var j = 1; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }
                handle.apply(this, args);
            }
        }
    }

    request_wxLogin(req: any, callback: any) {
        this._request("wxlogin", req, callback)
    }
}