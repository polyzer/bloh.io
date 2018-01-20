var Player = function (json_params)
{
    var json_params_names = [
        "Target",
        "AddVec"
    ];

    setParametersByArray.call(this, json_params, json_params_names);

    this.init();

};
Player.prototype.init = function (){
    this.Variables = {
        Mesh : this.Target,
        timeTopBorder: 10,
        timeBottomBorder: 0,
        step: 0.1,
        currentTime: 0,
        jumpForce: 10,
        startedPos: this.Target.position.z,
        addVec: this.AddVec,
        nextUp: false,
        nextForward: false,
        up: 10,
        forward: 10,
        weight: 1,
        rank: 1
    };
};

Player.prototype.update = function ()
{
    this.Target.position.add(this.Variables.addVec);
    //this.Variables.step = this.Variables.addVec.length;
    if(this.Variables.currentTime < this.Variables.timeTopBorder)//+ (this.Variables.up*this.Variables.up
    {
        this.Target.position.z = this.Variables.startedPos-Math.pow(this.Variables.currentTime, 2)
            +this.Variables.currentTime*this.Variables.forward  ;//*this.Variables.jumpForce;
        this.Variables.currentTime += this.Variables.step;
    } else {
        this.Variables.currentTime = this.Variables.timeBottomBorder;
    }
    if (this.Variables.rank>7)
        this.Variables.rank=7;

    /*
    if (this.Variables.nextUp){
        this.Variables["up"] = this.Variables.rank*2*this.Variables.up;
        this.Variables.nextUp = false;

    }
    else
        this.Variables.up = this.Variables.rank*this.Variables.up;
    if (this.Variables.nextForward)
    {
        this.Variables["forward"] = 3;
        this.Variables.nextForward = false;

    }
    else
        this.Variables.forward = 0;*/


};
