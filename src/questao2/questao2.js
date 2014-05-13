var vertPosBuf;
var vertTextBuf;
var gl;
var shader;
var centerX;
var centerY;
var radius;
var angle;

var video, videoImage, videoImageContext, videoTexture;

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

    var vPos = new Array;
    var vTex = new Array;

    vPos = [
        // right triangle
        -1.0, -1.0, 0.0, // V0
         1.0, -1.0, 0.0, // V1
         1.0,  1.0, 0.0,  // V2

        // left triangle
        -1.0, -1.0, 0.0,  // V0
         1.0,  1.0, 0.0,  // V2
        -1.0,  1.0, 0.0   // V3
    ];

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
	
	gl.uniform2f(shader.TextureSizeUniform, gl.viewportWidth, gl.viewportHeight);
	
	// Get Raio
	radius = parseFloat(document.getElementById("radius").value);
	gl.uniform1f(shader.RadiusUniform, radius);
	
	// Get Angle
	angle = parseFloat(document.getElementById("angle").value);
	gl.uniform1f(shader.AngleUniform, angle);
	
	// Get center of image	
	gl.uniform2f(shader.CenterUniform, centerX, centerY);

	gl.uniform1i(shader.SamplerUniform, 0);

	gl.enableVertexAttribArray(shader.vertexPositionAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuf);
	gl.vertexAttribPointer(shader.vertexPositionAttribute, vertPosBuf.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.enableVertexAttribArray(shader.vertexTextAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertTextBuf);
	gl.vertexAttribPointer(shader.vertexTextAttribute, vertTextBuf.itemSize, gl.FLOAT, false, 0, 0);

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
	
	// define center of distortion
	centerX = canvas.width/2;
	centerY = canvas.height/2;
	
	// add listeners
	canvas.addEventListener("click", changeCenterWrapByClick, false);
	radiusRange = document.getElementById('radius');
	radiusRange.addEventListener("input", changeCenterWrapByRange, false);

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

	shader.TextureSizeUniform		= gl.getUniformLocation(shader, "uTextureSize");
	shader.CenterUniform			= gl.getUniformLocation(shader, "uCenter");
	shader.RadiusUniform			= gl.getUniformLocation(shader, "uRadius");
	shader.AngleUniform				= gl.getUniformLocation(shader, "uAngle");

	if ( 	(shader.vertexPositionAttribute < 0) ||
			(shader.vertexTextAttribute < 0) ||
			(shader.SamplerUniform < 0) ) {
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

/*
	Muda o centro da distorção.
	Caso a posição distorça as bordas é recalculada uma nova posição válida.
*/

function changeCenterWrapByClick(e) {
	
	// get the click position
	x = e.x - canvas.offsetLeft;
	y = -((e.y - canvas.offsetTop) - canvas.height);
	
	// default center position
	centerX = x;
	centerY = y;
	
	if(radius > x){ // limite à esquerda
		centerX = x + (radius - x);
	}
	if(radius > y) { // limite ao chão
		centerY = y + (radius - y);
	}		
	if(radius > (canvas.width - x)) { // limite à direita
		centerX -= radius - (canvas.width - x);
	}
	if(radius > (canvas.height - y)) { // limite ao topo
		centerY -= radius - (canvas.height - y);
	}
}

/*
	Caso o novo raio ultrapasse os limites para distorcer as bordas
	é calculada uma nova posição para o centro da distorção.
*/

function changeCenterWrapByRange(e) {
	
	// get the radius
	radius = e.currentTarget.value;
	
	if(radius > centerX){ // limite à esquerda
		centerX = centerX + (radius - centerX);
	}
	if(radius > centerY) { // limite ao chão
		centerY = centerY + (radius - centerY);
	}		
	if(radius > (canvas.width - centerX)) { // limite à direita
		centerX -= radius - (canvas.width - centerX);
	}
	if(radius > (canvas.height - centerY)) { // limite ao topo
		centerY -= radius - (canvas.height - centerY);
	}
}