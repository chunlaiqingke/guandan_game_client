import { _decorator, Component, Label, Node, Prefab } from 'cc';
import myglobal from '../myglobal';
const { ccclass, property } = _decorator;

@ccclass('gameScene')
export class gameScene extends Component {

    @property(Label)
    public di_label: Label = null;
    @property(Label)
    public beishu_label: Label = null;
    @property(Label)
    public roomid_label: Label = null;
    @property(Prefab)
    public player_node_prefabs: Prefab = null;
    @property(Node)
    public players_seat_pos: Node = null;

    private playerNodeList: Node[] = [];
    private roomState: number;
    
    protected onLoad(): void {
        this.di_label.string = "底" + myglobal.playerData.bottom.toString()
        this.beishu_label.string = "倍数" + myglobal.playerData.rate.toString()
        this.roomState = RoomState.ROOM_INVALID;

        //监听，给其他玩家发牌
        this.node.on("pushcard_other_event",function(){
            console.log("gamescene pushcard_other_event")
            for(var i=0;i<this.playerNodeList.length;i++){
                    var node = this.playerNodeList[i]
                    if(node){
                    //给playernode节点发送事件
                        node.emit("push_card_event")
                    }
            }
        }.bind(this))

        //监听房间状态改变事件
        myglobal.socket.onRoomChangeState(function(data: any){
            //回调的函数参数是进入房间用户消息
            console.log("onRoomChangeState:"+data)
            this.roomstate = data
        }.bind(this))

        this.node.on("choose_card_event",function(event: any){
            console.log("--------choose_card_event-----------")
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               console.log("get childer name gameingUI")
               return
            }
            gameui_node.emit("choose_card_event",event)
           
        }.bind(this))

        this.node.on("unchoose_card_event",function(event: any){
            console.log("--------unchoose_card_event-----------")
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               console.log("get childer name gameingUI")
               return
            }
            gameui_node.emit("unchoose_card_event",event)
        }.bind(this))
    }
}

