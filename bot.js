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
        Mesh : this.Target,
        timeTopBorder: 2,
        timeBottomBorder: 0,
        step: 0.05,
        currentTime: 0+this.TimeTarget,
        jumpForce: 10,
        startedPos: this.Target.position.z,
            addVec: this.AddVec,
        roomSize : 100
    };



};

Bot.prototype.update = function ()
{
    this.Target.position.add(this.Variables.addVec);
    if(this.Variables.currentTime < this.Variables.timeTopBorder)
    {
        this.Target.position.z = this.Variables.startedPos+Math.pow((this.Variables.currentTime-1), 2)*this.Variables.jumpForce;
        this.Variables.currentTime += this.Variables.step;
    } else {
        this.Variables.currentTime = this.Variables.timeBottomBorder;

    }
    if (Math.abs(this.Target.position.x+this.Variables.addVec.x)>this.Variables.roomSize)
        this.Variables.addVec.x-=2* this.Variables.addVec.x;

    if (Math.abs(this.Target.position.y+this.Variables.addVec.y)>this.Variables.roomSize)
        this.Variables.addVec.y-=2* this.Variables.addVec.y;
};
