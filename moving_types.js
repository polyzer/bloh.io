var ParabolicMoving = function (json_params)
{
    var json_params_names = [
        "Target"
    ];

    setParametersByArray.call(this, json_params, json_params_names);

    this.Variables = {
        timeTopBorder: 2,
        timeBottomBorder: 0,
        step: 0.05,
        currentTime: 0,
        jumpForce: 10,
        startedPos: this.Target.position.z
    };
};

ParabolicMoving.prototype.update = function ()
{
    if(this.Variables.currentTime < this.Variables.timeTopBorder)
    {
        this.Target.position.z = this.Variables.startedPos+Math.pow((this.Variables.currentTime-1), 2)*this.Variables.jumpForce;
        this.Variables.currentTime += this.Variables.step;
    } else {
        this.Variables.currentTime = this.Variables.timeBottomBorder;

    }
};
