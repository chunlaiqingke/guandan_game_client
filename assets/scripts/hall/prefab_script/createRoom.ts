import { _decorator, Component, Node, director } from 'cc';
import myglobal from '../../myglobal';
const { ccclass, property } = _decorator;

@ccclass('createRoom')
export class createRoom extends Component {
    start() {

    }

    onButtonClick(event: any, customData: any) {
        switch(customData) {
            case "create_room_1":
                this._createroom(1)
                break;
            case "create_room_2":
                this._createroom(2)
                break;
            case "create_room_3":
                this._createroom(3)
                break;
            case "create_room_4":
                this._createroom(4)
                break;
            case "create_room_close":
                this.node.destroy()
                break;
            default:
                break;
        }
        this.node.destroy()
    }

    _createroom(rate: number) {
        if (rate < 0 || rate > 4) {
            console.log("create room rate error" + rate)
            return
        }
        var global = 0
        if (rate == 1) {
            global = 10
        } else if (rate == 2) {
            global = 20
        } else if (rate == 3) {
            global = 30
        } else if (rate == 4) {
            global = 40
        }
        
        var room_para = {
            global: global,
            rate: rate,
        }

        myglobal.socket.request_createroom(room_para, function(err, result) {
            if (err != 0) {
                console.log("create room error" + err)
            } else {
                console.log("create room : " + JSON.stringify(result))
                director.loadScene("game")
            }
        })
    }
}

