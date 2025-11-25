import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import myglobal from '../../myglobal';

const { ccclass, property } = _decorator;

@ccclass('player_node')
export class player_node extends Component {

    @property(Node)
    private readyimage: Node = null;
    @property(Node)
    private offlineimage: Node = null;
    @property(Node)
    private cardNode: Node = null;
    @property(Prefab)
    private card_prefabs: Prefab = null;

    public accountId: string;
    public seatIndex: number;

    start() {

    }

    onLoad() {
        this.readyimage.active = false
        this.offlineimage.active = false

        this.node.on("gamestart_event", function (event: any) {
            this.readyimage.active = false
        })

        this.node.on("push_card_event", function (event: any) {
            if (this.accountId == myglobal.playerData.accountId) {
                return
            }
            this.pushCard()
        })
    }

    public init_data(data: any, index: number) {

    }

    private pushCard() { 
        this.cardNode.active = true
        for (var i = 0; i < 17; i++) {
            var card: Node = instantiate(this.card_prefabs) as Node;
            card.setScale(0.6, 0.6)
            card.parent = this.cardNode;
            var ut = card.getComponent("UITransform") as UITransform;
            var height = ut.getBoundingBox().height
        }
    }
}

