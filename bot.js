var Bot = function (json_params)
{
    var json_params_names = [
        "Target",
        "TimeTarget",
        "AddVec"
    ];

    setParametersByArray.call(this, json_params, json_params_names);

    this.init();

};
Bot.prototype.init = function (){
        this.Variables = {
            Mesh: this.Target,
            timeTopBorder: 2,
            timeBottomBorder: 0,
            step: 0.05,
            currentTime: 0 + this.TimeTarget,
            jumpForce: 10,
            startedPos: this.Target.position.z,
            addVec: this.AddVec,
            life: true,
            planeSize: 10,
            floorSizeX: 40,
            floorSizeY: 40
        }
};
Bot.prototype.update = function ()
{
    this.Target.position.add(this.Variables.addVec);
    if(this.Variables.currentTime < this.Variables.timeTopBorder)
    {
        this.Target.position.z = this.Variables.startedPos+Math.pow((this.Variables.currentTime-1), 2)*this.Variables.jumpForce;
        this.Variables.currentTime += this.Variables.step;
    } else
        this.Variables.currentTime = this.Variables.timeBottomBorder;/*
    this.Variables.intX=1;//Math.ceil(-this.Variables.floorSizeX/2+this.Target.position.x/this.Variables.planeSize);
    this.Variables.intY=1;//Math.ceil(-this.Variables.floorSizeY/2+this.Target.position.y/this.Variables.planeSize);
    if (this.Floor[this.Variables.intX][this.Variables.intY].Variables.LifeStatus)
        this.Floor[this.Variables.intX][this.Variables.intY].Variables.LifeStatus = false;*/
    if (Math.abs(this.Target.position.x+this.Variables.addVec.x)>this.Variables.floorSizeX/2*this.Variables.planeSize)
        this.Variables.addVec.x-=2* this.Variables.addVec.x;
    if (Math.abs(this.Target.position.y+this.Variables.addVec.y)>this.Variables.floorSizeY/2*this.Variables.planeSize)
        this.Variables.addVec.y-=2* this.Variables.addVec.y;
};
