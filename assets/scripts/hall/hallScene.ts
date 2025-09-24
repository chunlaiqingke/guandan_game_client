import { _decorator, Component, Label, Sprite, Prefab, instantiate } from 'cc';
import myglobal from '../myglobal';
const { ccclass, property } = _decorator;

@ccclass('hallScene')
export class hallScene extends Component {

    @property(Label)
    nickname_label: Label;
    @property(Sprite)
    headimage:Sprite;
    @property(Label)
    gobal_count:Label;
    @property(Prefab)
    creatroom_prefabs:Prefab;
    @property(Prefab)
    joinroom_prefabs:Prefab;

    start() {

    }

    onLoad() {
        this.nickname_label.string = myglobal.playerData.nickName
        this.gobal_count.string = ":" + myglobal.playerData.gobalCount
    }

    onButtonClick(event: any, customData: any) { 
        switch(customData){
            case "create_room":
                var creator_Room = instantiate(this.creatroom_prefabs)
                creator_Room.parent = this.node 
                creator_Room.setSiblingIndex(100)
                break
            case "join_room":
                var join_Room = instantiate(this.joinroom_prefabs)
                join_Room.parent = this.node 
                join_Room.setSiblingIndex(100)
                break
            default:
                break
        }
    }
}

