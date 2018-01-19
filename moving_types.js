var ParabolicMoving = function (json_params)
{
    var json_params_names = [
        "Target",
        "AddVec"
    ];

    setParametersByArray.call(this, json_params, json_params_names);

    this.Variables = {
        timeTopBorder: 2,
        timeBottomBorder: 0,
        step: 0.05,
        currentTime: 0,
        jumpForce: 10,
        startedPos: this.Target.position.z,
        nextUp: false,
        nextForward: false,
        up: 1,
        forward: 0,
        addVec: this.AddVec
    };
};

ParabolicMoving.prototype.update = function ()
{
    if(this.Variables.currentTime < this.Variables.timeTopBorder*this.Variables.up)
    {
        this.Target.position.add(this.Variables.addVec);
        this.Target.position.z = this.Variables.startedPos + (this.Variables.up*this.Variables.up-Math.pow(
            (this.Variables.currentTime-this.Variables.up), 2)//+this.Variables.forward
        )*this.Variables.jumpForce;
        this.Variables.currentTime += this.Variables.step;
    } else {
        this.Variables.currentTime = this.Variables.timeBottomBorder;
        if (this.Variables.nextUp)
        {
            this.Variables["up"] = 3;
            this.Variables.nextUp = false;

        }
        else
            this.Variables.up = 1;

    }
};

