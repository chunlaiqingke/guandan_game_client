import { SocketIOManager } from "./lib/SocketIOManager";
import { PlayerData } from "./data/player";

let myglobal = {
    socket: SocketIOManager.instance,
    playerData: new PlayerData()
}

export default myglobal;