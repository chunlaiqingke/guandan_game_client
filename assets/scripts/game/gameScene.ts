import { _decorator, assert, AudioSource, Component, Label, Node, Prefab, instantiate } from 'cc';
import myglobal from '../myglobal';
import { player_node } from './prefabs/player_node';
import { isopen_sound, RoomState } from '../defines';

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
    @property(AudioSource)
    public audio_source: AudioSource = null;

    private playerNodeList: Node[] = [];
    private playerdata_list_pos: Map<number, number> = new Map<number, number>();
    private roomState: number;
    
    protected onLoad(): void {
        this.di_label.string = "底" + myglobal.playerData.bottom.toString()
        this.beishu_label.string = "倍数" + myglobal.playerData.rate.toString()
        this.roomState = RoomState.ROOM_INVALID

        //监听，给其他玩家发牌
        this.node.on("pushcard_other_event",function(){
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
            
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               return
            }
            gameui_node.emit("choose_card_event",event)
           
        }.bind(this))

        this.node.on("unchoose_card_event",function(event: any){
            
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               return
            }
            gameui_node.emit("unchoose_card_event",event)
        }.bind(this))

        myglobal.socket.request_enter_room({},function(err: number ,result: any){
            if(err!=0){
               console.log("enter_room_resp err:"+err)
            }else{
            
              //enter_room成功
              //notify ={"seatid":1,"playerdata":[{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}]}
                var seatid = result.seatindex //自己在房间里的seatid
                this.playerdata_list_pos = new Map<number, number>()  //3个用户创建一个空用户列表
                this.setPlayerSeatPos(seatid)

                var playerdata_list = result.playerdata
                var roomid = result.roomid
                this.roomid_label.string = "房间号:" + roomid
                
                for(var i=0;i<playerdata_list.length;i++){
                    //consol.log("this----"+this)
                    this.addPlayerNode(playerdata_list[i])
                }

                // if(isopen_sound){
                //     const as = this.node.getComponent(AudioSource);
                //     assert(as, "audio source is null");
                //     this.audio_source = as;
                //     this.audio_source.play();
                // }
            }
            var gamebefore_node = this.node.getChildByName("gamebeforeUI")
            gamebefore_node.emit("init")
        }.bind(this))

        myglobal.socket.onPlayerJoinRoom(function (join_playerdata) { 
            this.addPlayerNode(join_playerdata)
        }.bind(this))

        myglobal.socket.onPlayerReady(function (data) { 
            for (var i = 0; i < this.player_node_list.length; i++) {
                var node = this.player_node_list[i]
                if (node) {
                    node.emit("player_ready_notify", data)
                }
            }
        }.bind(this))

        myglobal.socket.onGameStart(function (data) {
            for (var i = 0; i < this.player_node_list.length; i++) {
                var node = this.player_node_list[i]
                if (node) {
                    node.emit("game_start_notify", data)
                }
            }
            //隐藏gamebeforeUI节点
            var gamebeforeUI = this.node.getChildByName("gamebeforeUI")
            if (gamebeforeUI) {
                gamebeforeUI.active = false
            }
        }.bind(this))
    }

    setPlayerSeatPos(seat_index: number) {
        if (seat_index < 1 || seat_index > 4) {
            console.log("add viewer: "+seat_index)
            return;
        }

        console.log("setPlayerSeatPos seat_index:" + seat_index)

        //界面位置转化成逻辑位置
        switch (seat_index) {
            case 1: 
                this.playerdata_list_pos.set(1, 0)
                this.playerdata_list_pos.set(2, 1)
                this.playerdata_list_pos.set(3, 2)
                this.playerdata_list_pos.set(4, 3)
                break;
            case 2:
                this.playerdata_list_pos.set(2, 0)
                this.playerdata_list_pos.set(3, 1)
                this.playerdata_list_pos.set(4, 2)
                this.playerdata_list_pos.set(1, 3)
                break;
            case 3:
                this.playerdata_list_pos.set(3, 0)
                this.playerdata_list_pos.set(4, 1)
                this.playerdata_list_pos.set(1, 2)
                this.playerdata_list_pos.set(2, 3)
                break;
            case 4:
                this.playerdata_list_pos.set(4, 0)
                this.playerdata_list_pos.set(1, 1)
                this.playerdata_list_pos.set(2, 2)
                this.playerdata_list_pos.set(3, 3)
                break;
            default:
                break;
        }
    }

    addPlayerNode(player_data: any) {
        var playernode_inst = instantiate(this.player_node_prefabs)
        playernode_inst.parent = this.node
        this.playerNodeList.push(playernode_inst)

        var index = this.playerdata_list_pos.get(player_data.seatindex)
        playernode_inst.position = this.players_seat_pos.children[index].position
        var node = playernode_inst.getComponent("player_node") as player_node
        node.init_data(player_data, index)
    }

    /*
     //通过accountid获取用户出牌放在gamescene的位置 
     做法：先放3个节点在gameacene的场景中cardsoutzone(012)
    */
    public getUserOutCardPosByAccount(accountid){
        
    }
}

