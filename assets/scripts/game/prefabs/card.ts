import { _decorator, Component, Node, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('card')
export class card extends Component {

    @property(SpriteAtlas)
    private cards_sprite_atlas: SpriteAtlas = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

