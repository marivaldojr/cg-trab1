var vertPosBuf;
var vertTextBuf;
var triangleVertexPositionBuffer;
var triangleTextureBuffer;
var gl;
var shader;

var video, videoImage, videoImageContext, videoTexture;
var image, imagemTexture;

var hue, saturation, lightness;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

// ********************************************************
// ********************************************************
function gotStream(stream)  {
    if (window.URL) {
        video.src = window.URL.createObjectURL(stream);   }
    else {
        video.src = stream;
    }

    video.onerror = function(e) {
        stream.stop();
    };
    stream.onended = noStream;
}

// ********************************************************
// ********************************************************
function noStream(e) {
    var msg = "No camera available.";

    if (e.code == 1) {
        msg = "User denied access to use camera.";
    }
    document.getElementById("output").textContent = msg;
}

// ********************************************************
// ********************************************************
function initGL(canvas) {

    var gl = canvas.getContext("webgl");
    if (!gl) {
        return (null);
    }

    gl.viewportWidth 	= canvas.width;
    gl.viewportHeight 	= canvas.height;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    return gl;
}

// ********************************************************
// ********************************************************
function initBuffers(gl) {
    var vPos = new Array;
    var vTex = new Array;

    vPos.push(-1.0); 	// V0
    vPos.push(-1.0);
    vPos.push( 0.0);
    vPos.push( 1.0);	// V1
    vPos.push(-1.0);
    vPos.push( 0.0);
    vPos.push( 1.0);	// V2
    vPos.push( 1.0);
    vPos.push( 0.0);
    vPos.push(-1.0); 	// V0
    vPos.push(-1.0);
    vPos.push( 0.0);
    vPos.push( 1.0);	// V2
    vPos.push( 1.0);
    vPos.push( 0.0);
    vPos.push(-1.0);	// V3
    vPos.push( 1.0);
    vPos.push( 0.0);
    vertPosBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPos), gl.STATIC_DRAW);
    vertPosBuf.itemSize = 3;
    vertPosBuf.numItems = vPos.length/vertPosBuf.itemSize;

    vTex.push( 0.0); 	// V0
    vTex.push( 0.0);
    vTex.push( 1.0);	// V1
    vTex.push( 0.0);
    vTex.push( 1.0);	// V2
    vTex.push( 1.0);
    vTex.push( 0.0); 	// V0
    vTex.push( 0.0);
    vTex.push( 1.0);	// V2
    vTex.push( 1.0);
    vTex.push( 0.0);	// V3
    vTex.push( 1.0);
    vertTextBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertTextBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTex), gl.STATIC_DRAW);
    vertTextBuf.itemSize = 2;
    vertTextBuf.numItems = vTex.length/vertTextBuf.itemSize;

    initBuffersImage(gl);
}

function initBuffersImage(gl) {
    var vPosImage = new Array;
    var vTexImage = new Array;

    vPosImage.push(-1.0); 	// V0
    vPosImage.push(-1.0);
    vPosImage.push( 0.0);

    vPosImage.push( 1.0);	// V1
    vPosImage.push(-1.0);
    vPosImage.push( 0.0);

    vPosImage.push( 1.0);	// V2
    vPosImage.push( 1.0);
    vPosImage.push( 0.0);

    vPosImage.push(-1.0); 	// V0
    vPosImage.push(-1.0);
    vPosImage.push( 0.0);

    vPosImage.push( 1.0);	// V2
    vPosImage.push( 1.0);
    vPosImage.push( 0.0);

    vPosImage.push(-1.0);	// V3
    vPosImage.push( 1.0);
    vPosImage.push( 0.0);

    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPosImage), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = vPosImage.length/triangleVertexPositionBuffer.itemSize;

    vTexImage.push( 0.0); 	// V0
    vTexImage.push( 0.0);
    vTexImage.push( 1.0);	// V1
    vTexImage.push( 0.0);
    vTexImage.push( 1.0);	// V2
    vTexImage.push( 1.0);
    vTexImage.push( 0.0); 	// V0
    vTexImage.push( 0.0);
    vTexImage.push( 1.0);	// V2
    vTexImage.push( 1.0);
    vTexImage.push( 0.0);	// V3
    vTexImage.push( 1.0);
    triangleTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTexImage), gl.STATIC_DRAW);
    triangleTextureBuffer.itemSize = 2;
    triangleTextureBuffer.numItems = vTexImage.length/triangleTextureBuffer.itemSize;
}

// ********************************************************
// ********************************************************
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!videoTexture.needsUpdate)
        return;

    gl.useProgram(shader);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoImage);
    videoTexture.needsUpdate = false;
    gl.uniform1i(shader.SamplerUniform, 0);

    // input cores
    hue = parseFloat(document.getElementById('h').value);
    saturation = parseFloat(document.getElementById('s').value);
    lightness = parseFloat(document.getElementById('l').value);
    gl.uniform1f(shader.FloatHueUniform, hue);
    gl.uniform1f(shader.FloatSaturationUniform, saturation);
    gl.uniform1f(shader.FloatLightnessUniform, lightness);

    gl.enableVertexAttribArray(shader.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuf);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, vertPosBuf.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(shader.vertexTextAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertTextBuf);
    gl.vertexAttribPointer(shader.vertexTextAttribute, vertTextBuf.itemSize, gl.FLOAT, false, 0, 0);

    //
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, imagemTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(shader.SamplerImageUniform, 1);

    gl.enableVertexAttribArray(shader.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(shader.vertexTextAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleTextureBuffer);
    gl.vertexAttribPointer(shader.vertexTextAttribute, triangleTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertPosBuf.numItems);
}

// ********************************************************
// ********************************************************
function initTexture(gl, shader) {

    videoTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    videoTexture.needsUpdate = false;

    // imagem
    imagemTexture = gl.createTexture();

    image = new Image();
    image.onload = function(){

        gl.bindTexture(gl.TEXTURE_2D, imagemTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        drawScene();
    }
    image.src = "lena.png";
}

// ********************************************************
// ********************************************************
function webGLStart() {
    if (!navigator.getUserMedia) {
        document.getElementById("output").innerHTML =
            "Sorry. <code>navigator.getUserMedia()</code> is not available.";
    }
    navigator.getUserMedia({video: true}, gotStream, noStream);

    // assign variables to HTML elements
    video = document.getElementById("monitor");
    videoImage = document.getElementById("videoImage");
    videoImageContext = videoImage.getContext("2d");

    // background color if no video present
    videoImageContext.fillStyle = "#005337";
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    canvas = document.getElementById("videoGL");
    gl = initGL(canvas);

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
        return;
    }

    shader = initShaders("shader", gl);
    if (shader == null) {
        alert("Erro na inicilizacao do shader!!");
        return;
    }

    shader.vertexPositionAttribute 	= gl.getAttribLocation(shader, "aVertexPosition");
    shader.vertexTextAttribute 		= gl.getAttribLocation(shader, "aVertexTexture");
    shader.SamplerUniform	 		= gl.getUniformLocation(shader, "uSampler");
    shader.SamplerImageUniform	    = gl.getUniformLocation(shader, "uSamplerImage");

    shader.FloatHueUniform	        = gl.getUniformLocation(shader, "hue");
    shader.FloatSaturationUniform	= gl.getUniformLocation(shader, "saturation");
    shader.FloatLightnessUniform	= gl.getUniformLocation(shader, "lightness");

    if ( 	(shader.vertexPositionAttribute < 0) ||
        (shader.vertexTextAttribute < 0) ||
        (shader.SamplerUniform < 0) ||
        (shader.SamplerImageUniform < 0) ) {
        alert("Shader attribute ou uniform nao localizado!");
        return;
    }

    initBuffers(gl);
    initTexture(gl, shader);
    animate(gl, shader);
}

function animate(gl, shader) {
    requestAnimationFrame( animate );
    render();
}

function render() {

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
        try{
            videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
            videoTexture.needsUpdate = true;
        }catch (e){
            if (e.name == "NS_ERROR_NOT_AVAILABLE") {
                console.log("ERROR: " + e.name);
            } else {
                throw e;
            }
        }
    }
    drawScene();
}