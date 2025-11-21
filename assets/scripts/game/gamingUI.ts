import { _decorator, Component, Node, Prefab, Label, AudioSource, Vec3, instantiate } from 'cc';
import myglobal from '../myglobal';
import { isopen_sound } from '../defines';
const { ccclass, property } = _decorator;

@ccclass('gamingUI')
export class gamingUI extends Component {

    @property(Node)
    gameingUI: Node = null
    @property(Prefab)
    card_prefabs: Prefab = null
    @property(Node)
    playingUI_node: Node = null
    @property(Label)
    tips_label: Label = null
    @property(AudioSource)
    fapai_audioID: AudioSource = null 

    private card_node_list: Node[] = []
    private card_width = 0
    private rob_player_accountid = 0
    private fapai_end = false
    private choose_card_data: any[] = []
    private outcar_zone: any[] = []
    private push_card_tmp: any[] = []
    private card_data: any[] = []
    private cur_index_card = 0
    private cards_nods: Node[] = []


    protected onLoad(): void {
        
        //服务器下发牌
        myglobal.socket.onPushCards(function(data: any) {
            this.card_data = data
            this.cur_index_card = data.length - 1
            this.pushCard(data)
            
            this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
            this.node.parent.emit("pushcard_other_event")
        }.bind(this))

        myglobal.socket.onCanChuCard(function(data: any) {
            if (data == myglobal.playerData.accountId) {
                this.clearOutZone(myglobal.playerData.accountId)
                this.playingUI_node.active = true
            }
        }.bind(this))

        myglobal.socket.onOtherPlayerChuCard(function(data: any) {
            var accountId = data.accountId
            var gameScene_script = this.node.parent.getComponent("gameScene")
            var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountId)
            if (outCard_node == null) {
                return
            }
            
            var node_cards = []
            for (var i = 0; i < data.cards.length; i++) {
                var card = instantiate(this.card_prefab)
                card.getComponent("card").showCard(data.cards[i].card_data, myglobal.playerData.accountId)
                node_cards.push(card)
            }
            this.appendOtherCardsToOutZone(outCard_node, node_cards, 0)
        }.bind(this))

        this.node.on("choose_card_event",function(event){
            console.log("choose_card_event:"+JSON.stringify(event))
            var detail = event
            this.choose_card_data.push(detail)
        }.bind(this))

        this.node.on("unchoose_card_event",function(event){
            console.log("unchoose_card_event:"+ event)
            var detail = event
            for(var i=0;i<this.choose_card_data.length;i++){
                if(this.choose_card_data[i].cardid==detail){
                    this.choose_card_data.splice(i,1)
                }
            }
        }.bind(this))
    }

    private clearOutZone(accountId: string) { 
        
    }

    private _runactive_pushcard() {
        if(this.cur_index_card < 0){
            console.log("pushcard end")
            //发牌动画完成，显示抢地主按钮
            //this.robUI.active = true
            this.fapai_end = true

            if(isopen_sound){
                //console.log("start fapai_audioID"+this.fapai_audioID) 
                this.fapai_audioID.stop()
            }
           

              //通知gamescene节点，倒计时
            var sendevent = this.rob_player_accountid
            this.node.parent.emit("canrob_event",sendevent)

            return
        }

        
        var move_node: Node = this.cards_nods[this.cards_nods.length-this.cur_index_card-1]
        move_node.active = true
        this.push_card_tmp.push(move_node)
        this.fapai_audioID.play()
        for(var i=0;i<this.push_card_tmp.length-1;i++){
            var move_node: Node = this.push_card_tmp[i]
            var newx: number = move_node.position.x - (this.card_width * 0.4)
            move_node.position.set(new Vec3(newx, -250, 0))
        }
        
        this.cur_index_card--
        this.scheduleOnce(this._runactive_pushcard.bind(this),0.1)
    }
}

