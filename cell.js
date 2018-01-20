var Cell = function (json_params)
{
    var json_params_names = [
        "Target",
        "Status"
    ];


    setParametersByArray.call(this, json_params, json_params_names);

    this.init();

};
Cell.prototype.init = function (){
    this.Variables = {
        Mesh : this.Target,
        LifeStatus: this.Status
    };
};

Cell.prototype.update = function ()
{
    if(this.Variables.LifeStatus)
        this.Variables.Mesh.material.color.set(0xF4C430);
    else
        this.Variables.Mesh.material.color.set(0x3B005C);
};