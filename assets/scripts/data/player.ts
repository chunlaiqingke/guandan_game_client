
export class PlayerData {

    public uniqueId : string;
    public accountId : string;
    public nickName : string;
    public avatarUrl : string;
    public gobalCount : number;
    public masterAccountId : string;
    public bottom : number;
    public rate : number;
    public houseManagerId : string;

    public getRandomStr(count: number) {
        let str: string = '';
        for (var i = 0 ; i < count ; i ++){
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }

    public constructor(){
        this.uniqueId = 1 + this.getRandomStr(6)
        this.accountId = "2" + this.getRandomStr(6)
        this.nickName = "tiny" + this.getRandomStr(3)
        var str = "avatar_" + (Math.floor(Math.random() * 3) + 1)
        this.avatarUrl = str   //随机一个头像
        this.gobalCount = 0
        this.masterAccountId = "0"
        this.bottom = 0
        this.rate = 1
    }
}