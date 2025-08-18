import { _decorator, Component, Director, Node } from 'cc';
import myglobal from '../myglobal';
const { ccclass, property } = _decorator;

@ccclass('login')
export class login extends Component {

    onLoad () {
        //sound

    }

    start() {
        
    }

    onButtonClick(event: any, customData: string) {
        switch (customData) {
            case 'wx_login':
                myglobal.socket.request_wxLogin(myglobal.playerData, function(err,result){
                    //请求返回
                    //先隐藏等待UI
                    //this.wait_node.active = false
                    if(err!=0){
                       console.log("err:"+err)
                       return     
                    }

                    console.log("login sucess" + JSON.stringify(result))
                    myglobal.playerData.gobalCount = result.goldcount
                    Director.instance.loadScene("hallScene")
                }.bind(this));
                break;
            default:
                break;
        }
 
    }
}

