import { _decorator, Component, Node } from 'cc';
import myglobal from '../myglobal';
const { ccclass, property } = _decorator;

@ccclass('gameBeforeUI')
export class gameBeforeUI extends Component {

    @property(Node)
    public btn_ready: Node = null;
    @property(Node)
    public btn_gamestart: Node = null;

    start() {

    }

    protected onLoad(): void {
        this.btn_ready.active = false
        this.btn_gamestart.active = false

        //监听本地消息
        this.node.on("init", function () { 
            if(myglobal.playerData.houseManagerId == myglobal.playerData.accountId) {
                //自己是房主
                this.btn_ready.active = false
                this.btn_gamestart.active = true
            } else {
                this.btn_ready.active = true
                this.btn_gamestart.active = false
            }
        }.bind(this))

        myglobal.socket.onChangeHouseManager(function (data) { 
            myglobal.playerData.houseManagerId = data
            if(myglobal.playerData.houseManagerId==myglobal.playerData.accountId){
                //自己就是房主
                this.btn_gamestart.active = true
                this.btn_ready.active = false
            }else{
                this.btn_gamestart.active = false
                this.btn_ready.active = true
            }
        }.bind(this))
    }

    onButtonClick(event: any, customData: string) { 
        switch(customData){
            case "btn_start":
                myglobal.socket.request_startGame(function(err: number , data: any){
                    if(err!=0){
                        console.log("requestStart err"+err)
                    }else{
                        console.log("requestStart data"+ JSON.stringify(data))
                        
                    }
                });
                break;
            case "btn_ready":
                myglobal.socket.request_ready()
                break
            default:
                break
        }
    }
}

