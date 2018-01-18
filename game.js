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

    // this variable contain
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


    this.Mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(10,10,10),
        new THREE.MeshBasicMaterial({color: 0xFF0000})
    );
    this.Mesh.add(this.Camera);

    this.Camera.lookAt(this.Mesh.position);

//    this.Controls = new THREE.OrbitControls(this.Camera);
//    this.Controls.target = this.Mesh.position;

    this.Plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(200, 200, 32),
        new THREE.MeshBasicMaterial({color: 0x00FF00})
    );

    this.AxisHelper = new THREE.AxisHelper(100);
    this.Scene.add(this.AxisHelper);
    this.Scene.add(this.Plane);
    this.Scene.add(this.Mesh);


};

Game.prototype.movingControl = function ()
{

};

/*This function generates */
Game.prototype.trianglesTest = function (width, height)
{
    var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    this.Scene.add( light1 );

    var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, -1, 0 );
    this.Scene.add( light2 );

    var Geometry = new THREE.BufferGeometry();

    var trianglesCount = 100000;

    var positions = [];
    var normals = [];
    var colors = [];

    var Color = new THREE.Color();
    var n = 1000, n2 = n/2;
    var d = 12, d2 = d / 2;

    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    for (var i = 0; i < trianglesCount; i++)
    {
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;

        var ax = x + Math.random() * d - d2;
        var ay = y + Math.random() * d - d2;
        var az = z + Math.random() * d - d2;

        var bx = x + Math.random() * d - d2;
        var by = y + Math.random() * d - d2;
        var bz = z + Math.random() * d - d2;

        var cx = x + Math.random() * d - d2;
        var cy = y + Math.random() * d - d2;
        var cz = z + Math.random() * d - d2;

        positions.push(ax, ay, az);
        positions.push(bx, by, bz);
        positions.push(cx, cy, cz);

        //flat Face Normals

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        normals.push(cb.x, cb.y, cb.z);
        normals.push(cb.x, cb.y, cb.z);
        normals.push(cb.x, cb.y, cb.z);

        //colors

        var vx = (x/n) + 0.5;
        var vy = (y/n) + 0.5;
        var vz = (z/n) + 0.5;

        Color.setRGB(vx, vy, vz);

        colors.push(Color.r, Color.g, Color.b);
        colors.push(Color.r, Color.g, Color.b);
        colors.push(Color.r, Color.g, Color.b);

    }

    function disposeArray() {this.array = null;}

    Geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
    Geometry.addAttribute("normal", new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray));
    Geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3).onUpload(disposeArray));

    Geometry.computeBoundingSphere();

    var Material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });

    this.Mesh = new THREE.Mesh(Geometry, Material);
    this.Scene.add(this.Mesh);

    this.Camera.position.set(0,0, 100);
    this.Camera.lookAt(this.Scene.position);
    requestAnimationFrame(this.update);
    // this.Terrain = new THREE.BufferGeometry();
    // this.Terrain.

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
            this.Mesh.position.add(addVec);
            break;

        case "a":
        case "A":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.cross(this.yVector);
            addVec.multiplyScalar(-this.deltaTime);
            this.Mesh.position.add(addVec);

            break;

        case "s":
        case "S":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.normalize();
            addVec.z = 0;
            addVec.multiplyScalar(- this.deltaTime);
            this.Mesh.position.add(addVec);

            break;

        case "d":
        case "D":
            var addVec = this.Camera.getWorldDirection().clone();
            addVec.z = 0;
            addVec.normalize();
            addVec.cross(this.yVector);
            addVec.multiplyScalar(this.deltaTime);
            this.Mesh.position.add(addVec);

            break;
    }
};

Game.prototype.update = function (delta)
{
    this.deltaTime = delta*0.001;

    this.stats.update();
    if(Math.abs(this.dxCenter)> 30)
        this.Mesh.rotation.z += ((this.dxCenter/window.innerWidth*0.1));

    this.Renderer.render(this.Scene, this.Camera);

    requestAnimationFrame(this.update);
};