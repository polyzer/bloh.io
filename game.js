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
    this.Camera.position.set(0, -200, 100);
    this.Scene.add(this.Camera);

    this.Person = window.GLOBAL_OBJECTS.getPerson();

    // this.trianglesTest(100, 100);
    this.deltaTime = 0;
    this.yVector = new THREE.Vector3(0,0,1);

    this.Bots = [], this.BotsCurrentMovingType = [] ;

    for (var i=0; i<10; i++){
        this.CurrentBot = new THREE.Mesh(
            new THREE.BoxBufferGeometry(10,10,10),
            new THREE.MeshBasicMaterial({color: 0x0000FF})
        );
        this.CurrentBot.position.z = 5;
        this.CurrentBot.position.y = -100 + Math.random()*200;
        this.CurrentBot.position.x = -100 + Math.random()*200;

        this.BotMovingTypes = {
            Parabolic: new Bot({Target: this.CurrentBot, TimeTarget: Math.random()})
        };


        this.Bots[i] = this.BotMovingTypes.Parabolic;
        this.Scene.add(this.Bots[i].Variables.Mesh);
    }

    this.Mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(10,10,10),
        new THREE.MeshBasicMaterial({color: 0xFF0000})
    );
    this.Mesh.position.z = 5;
    this.ControlObject = new THREE.Object3D();
    this.ControlObject.add(this.Mesh);
    this.ControlObject.add(this.Camera);

    this.Camera.lookAt(this.ControlObject.position);

//    this.Controls = new THREE.OrbitControls(this.Camera);
//    this.Controls.target = this.Mesh.position;

    this.Plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(200, 200, 32),
        new THREE.MeshBasicMaterial({color: 0x00FF00})
    );

    this.lastTime = 0;
    this.AxisHelper = new THREE.AxisHelper(100);
    this.Scene.add(this.AxisHelper);
    this.Scene.add(this.Plane);
    this.Scene.add(this.ControlObject);

    this.MovingTypes = {
        Parabolic: new ParabolicMoving({Target: this.Mesh})
    };

    this.CameraAngle = new THREE.Vector3();
    this.CameraRadius = 200;

    this.CurrentMovingType = this.MovingTypes.Parabolic;
};

Game.prototype.onResize = function (event)
{
    this.Camera.aspect = window.innerWidth / window.innerHeight;
    this.Camera.updateProjectionMatrix();
    this.Renderer.setSize(window.innerWidth, window.innerHeight);
};

Game.prototype.collisionControl = function (delta)
{

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
            addVec.cross(this.yVector);
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
            addVec.cross(this.yVector);
            addVec.multiplyScalar(this.deltaTime);
            this.ControlObject.position.add(addVec);

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
    this.CurrentMovingType.update();
    for (var i=0; i<10; i++)
        this.Bots[i].update();


    if(Math.abs(this.dxCenter)> 30)
        this.CameraAngle.x -= ((this.dxCenter/window.innerWidth)*0.001);
    this.controlObjectRotation();
    this.Renderer.render(this.Scene, this.Camera);

    requestAnimationFrame(this.update);
};