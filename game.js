
"use strict";
var Game = function (json_params)
{
    var json_params_names = [

    ];
    setParametersByArray.call(this, json_params, json_params_names);

    this.init();

    requestAnimationFrame(this.update);
};

Game.prototype.init = function ()
{
    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keypress", this.onKeyPress);
    window.addEventListener("mousemove", this.onMouseMove);

    this.Renderer = new THREE.WebGLRenderer();
    this.Renderer.setPixelRatio(window.devicePixelRatio);
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
    this.Renderer.gammaInput = true;
    this.Renderer.gammaOutput = true;
    window.GLOBAL_OBJECTS.getGameContainer().appendChild(this.Renderer.domElement);

    this.stats = new Stats();
    window.GLOBAL_OBJECTS.getGameContainer().appendChild(this.stats.dom);

    this.dxCenter = 0;

    this.Scene = new THREE.Scene();

    this.Camera = new THREE.PerspectiveCamera(
        GAME_CONSTANTS.CAMERA_PARAMETERS.ANGLE,
        GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_WIDTH/GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_HEIGHT,
        GAME_CONSTANTS.CAMERA_PARAMETERS.NEAR,
        GAME_CONSTANTS.CAMERA_PARAMETERS.FAR
    );
    this.Camera.position.set(0, -300, 150);
    this.Scene.add(this.Camera);

    this.Person = window.GLOBAL_OBJECTS.getPerson();

    this.BotBox = new THREE.Box3();
    this.PlayerBox = new THREE.Box3();

    // this.trianglesTest(100, 100);
    this.deltaTime = 0;
    this.zVector = new THREE.Vector3(0,0,1);

    this.Bots = [], this.NumberOfBots=80;

    for (var i=0; i<this.NumberOfBots; i++){
        this.CurrentBot = new THREE.Mesh(
            new THREE.BoxBufferGeometry(10,10,10),
            new THREE.MeshBasicMaterial({color: 0x007FFF})
        );
        this.CurrentBot.position.z = 5;
        this.CurrentBot.position.y = -100 + Math.random()*200;
        this.CurrentBot.position.x = -100 + Math.random()*200;
        this.CurrentBotVec = new THREE.Vector3(-1+2*Math.random(),-1+2*Math.random(),0);

        this.BotMovingTypes = {
            Parabolic: new Bot({Target: this.CurrentBot, TimeTarget: Math.random() ,
                AddVec : this.CurrentBotVec})
        };
        this.Bots[i] = this.BotMovingTypes.Parabolic;
        this.Scene.add(this.Bots[i].Variables.Mesh);
    }

    this.Mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(10,10,10),
        new THREE.MeshBasicMaterial({color: 0xDC143C})
    );/*
    this.Mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry( this.Mesh.geometry ),
        new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } )
    ));*/
    this.Mesh.position.z = 5;
    this.ControlObject = new THREE.Object3D();
    this.ControlObject.add(this.Mesh);
    this.ControlObject.add(this.Camera);

    this.Camera.lookAt(this.ControlObject.position);

//    this.Controls = new THREE.OrbitControls(this.Camera);
//    this.Controls.target = this.Mesh.position;

    this.Plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(400, 400),
        new THREE.MeshBasicMaterial({color: 0xF4C430})
    );

    this.lastTime = 0;
    this.AxisHelper = new THREE.AxisHelper(100);
    this.Scene.add(this.AxisHelper);
    this.Scene.add(this.Plane);
    this.Scene.add(this.ControlObject);

    this.addVec = this.Camera.getWorldDirection().clone();
    this.addVec.z = 0;
    this.addVec.normalize();
    this.addVec.multiplyScalar(this.deltaTime);

    this.Player = new Player({Target: this.Mesh, AddVec: this.addVec });

    this.CameraAngle = new THREE.Vector3();
    this.CameraRadius = 200;

};

Game.prototype.onResize = function (event)
{
    this.Camera.aspect = window.innerWidth / window.innerHeight;
    this.Camera.updateProjectionMatrix();
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
};

Game.prototype.collisionControl = function (delta)
{
    this.PlayerBox.setFromObject (this.Player.Variables.Mesh);
    for (var i=this.Bots.length-1; i>0; i--){
            this.BotBox.setFromObject(this.Bots[i].Variables.Mesh);
            if ( this.PlayerBox.intersectsBox ( this.BotBox)){
                this.Scene.remove(this.Bots[i].Variables.Mesh);
                this.Bots.splice(i, 1);
                this.Player.Variables.weight++;
                if (Math.pow((this.Player.Variables.rank+1),2)==this.Player.Variables.weight)
                {
                    this.Player.Variables.rank++;/*
                    this.Player.Variables.Mesh.geometry.parameters.width+=10;
                    this.Player.Variables.Mesh.geometry.parameters.height+=10;
                    this.Player.Variables.Mesh.geometry.parameters.depth+=10;*/
                    this.Player.Variables.Mesh.geometry.scale(this.Player.Variables.rank/(this.Player.Variables.rank-1),
                        this.Player.Variables.rank/(this.Player.Variables.rank-1),
                        this.Player.Variables.rank/(this.Player.Variables.rank-1));
                    this.Player.Variables.startedPos=this.Player.Variables.rank*5;
                }
                this.CurrentBot = new THREE.Mesh(
                    new THREE.BoxBufferGeometry(10,10,10),
                    new THREE.MeshBasicMaterial({color: 0x007FFF})
                );
                this.CurrentBot.position.z = 5;
                this.CurrentBot.position.y = -100 + Math.random()*200;
                this.CurrentBot.position.x = -100 + Math.random()*200;
                this.CurrentBotVec = new THREE.Vector3(-1+2*Math.random(),-1+2*Math.random(),0);

                this.BotMovingTypes = {
                    Parabolic: new Bot({Target: this.CurrentBot, TimeTarget: Math.random() ,
                        AddVec : this.CurrentBotVec})
                };
                this.Bots.push(this.BotMovingTypes.Parabolic);
                //this.Bots[this.Bots.length] = this.BotMovingTypes.Parabolic;
                this.Scene.add(this.CurrentBot);
            }
    }
};

Game.prototype.onMouseMove = function (event)
{
    this.dxCenter = event.screenX - (window.innerWidth*0.5);
};

Game.prototype.onKeyPress = function (event)
{
    switch(String.fromCharCode(event.keyCode))
    {
        case "w":
        case "W":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.multiplyScalar(this.deltaTime);
            this.ControlObject.position.add(addVec);
            break;

        case "a":
        case "A":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.cross(this.zVector);
            addVec.multiplyScalar(-this.deltaTime);
            this.ControlObject.position.add(addVec);
            break;

        case "s":
        case "S":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.z = 0;
            addVec.multiplyScalar(- this.deltaTime);
            this.ControlObject.position.add(addVec);
            break;

        case "d":
        case "D":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.cross(this.zVector);
            addVec.multiplyScalar(this.deltaTime);
            this.ControlObject.position.add(addVec);
            break;

        case "q":
        case "Q":
            this.Player.Variables.nextUp = true;
            break;

        case "e":
        case "E":
            this.Player.Variables.nextForward = true;
            break;

    }
};

Game.prototype.cameraPositionControl = function ()
{
    this.Camera.position.x = this.ControlObject.position.x + Math.cos(this.CameraAngle.x)*this.CameraRadius;
    this.Camera.position.y = this.ControlObject.position.y + Math.sin(this.CameraAngle.x)*this.CameraRadius;
};

Game.prototype.controlObjectRotation = function ()
{
    this.ControlObject.rotation.z += this.CameraAngle.x;
};

Game.prototype.update = function (delta)
{
    this.deltaTime = (delta-this.lastTime)*0.1;
    this.lastTime = delta;

    this.stats.update();
    this.Player.update();
    this.collisionControl();
    for (var i=0; i<this.Bots.length; i++)
        this.Bots[i].update();
    if(Math.abs(this.dxCenter)> 10)
        this.CameraAngle.x = -((this.dxCenter/window.innerWidth)*0.1);
    this.controlObjectRotation();
    this.Renderer.render(this.Scene, this.Camera);
    requestAnimationFrame(this.update);
};