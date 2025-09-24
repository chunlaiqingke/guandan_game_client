import { _decorator, Component, Label, Node, director } from 'cc';
import myglobal from '../../myglobal';
const { ccclass, property } = _decorator;

@ccclass('joinRoom')
export class joinRoom extends Component {

    @property({ type: Label })
    joinids: Label[] = [];

    joinid: string;
    cur_input_count: number;

    onLoad() {
        this.joinid = "";
        this.cur_input_count = -1
    }

    start() {

    }

    onButtonClick(event: any, customData: any) {
        if (customData.length === 1) {
            this.joinid += customData;
            this.cur_input_count += 1;
            this.joinids[this.cur_input_count].string = customData;

            if (this.cur_input_count >= 6) {
                var room_para = {
                    roomid: this.joinid
                }
                myglobal.socket.request_joinroom(room_para, (err, result) => {
                    if (err) {
                        console.log("err" + err)
                    } else {
                        console.log("join room success, " + JSON.stringify(result))
                        director.loadScene("game")
                    }
                });
                return;
            }
            console.log("customData:"+ customData)
        }
        
        switch(customData) {
            case "back":
                if (this.cur_input_count < 0) {
                    return
                }
                this.joinids[this.cur_input_count].string = ""
                this.cur_input_count -= 1
                this.joinid = this.joinid.substring(0, this.joinid.length - 1)
                break;
            case "clear":
                for (var i = 0; i < this.joinids.length; i++) {
                    this.joinids[i].string = ""
                }
                this.joinid = ""
                this.cur_input_count = -1
                break;
            case "close":
                this.node.destroy()
                break;
            default:
                break;
        }
    }
}

