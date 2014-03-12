function create_wall_door(){

	// Coordinates
	var vertices = [
		 0.000,  0.000,  0.0125,
		 0.100,  0.000,  0.0125,
		 0.100,  0.450,  0.0125,
		 0.000,  0.450,  0.0125,
		 0.000,  0.000,  0.0375,
		 0.100,  0.000,  0.0375,
		 0.100,  0.450,  0.0375,
		 0.000,  0.450,  0.0375,
		 0.000,  0.450,  0.0000,
		 0.100,  0.450,  0.0000,
		 0.100,  0.600,  0.0000,
		 0.000,  0.600,  0.0000,
		 0.000,  0.450,  0.0500,
		 0.100,  0.450,  0.0500,
		 0.100,  0.600,  0.0500,
		 0.000,  0.600,  0.0500
	];

	// Normal of each vertex
	var normals = [
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0
	];

	// Indices of the vertices
	var indices = [
		 0,  1,  2,
		 0,  2,  3,
		 4,  5,  6,
		 4,  6,  7,
		 4,  0,  3,
		 4,  3,  7,
		 1,  5,  6,
		 1,  6,  2,
		 3,  2,  6,
		 3,  6,  7,
		 0,  1,  5,
		 0,  5,  4,
		 8,  9, 10,
		 8, 10, 11,
		12, 13, 14,
		12, 14, 15,
		12,  8, 11,
		12, 11, 15,
		 9, 13, 14,
		 9, 14, 10,
		11, 10, 14,
		11, 14, 15,
		 8,  9, 13,
		 8, 13, 12
	];

	var verticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	//attribute variable mapping to buffer
	var aPosition = gl.getAttribLocation(program,"aPosition");
	gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(aPosition);
	//unbind buffer to ARRAY_BUFFER POINTER
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	//attribute variable mapping to buffer
	var aNormal = gl.getAttribLocation(program,"aNormal");
	gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(aNormal);
	//unbind buffer to ARRAY_BUFFER POINTER
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//buffer creation
	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	//unbind buffer to gl.ELEMENT_ARRAY_BUFFER POINTER
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); 

	/*
	//buffer creation
	var texCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);

	//attribute variable mapping to buffer
	var aTexCoords = gl.getAttribLocation(program,"aTexCoords");
	gl.vertexAttribPointer(aTexCoords,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(aTexCoords);
	//unbind buffer to ARRAY_BUFFER POINTER
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	*/

	//set-up model matrix, view matrix, and projection matrix
	var modelMatrix = mat4.create();
	var uModel = gl.getUniformLocation(program,"uModel");
	gl.uniformMatrix4fv(uModel,false,modelMatrix);

	//add normal matrix
	var normalMatrix = mat4.create();
	var uNormal = gl.getUniformLocation(program,"uNormal");
	mat4.invert(normalMatrix,modelMatrix);
	mat4.transpose(normalMatrix,normalMatrix);
	gl.uniformMatrix4fv(uNormal,false,normalMatrix);

	var viewMatrix = mat4.create();
	var uView = gl.getUniformLocation(program,"uView");
	mat4.lookAt(viewMatrix,[1,0.25,2],[0,0.25,0],[0,1,0]);
	gl.uniformMatrix4fv(uView,false,viewMatrix);

	var projectionMatrix = mat4.create();
	var uProjection = gl.getUniformLocation(program,"uProjection");
	mat4.perspective(projectionMatrix,glMatrix.toRadian(30),canvas.width/canvas.height,1,100);
	//mat4.ortho(projectionMatrix,2,2,2,2,1,5);
	gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

	//set-up light and material parameters

	var uLightDirection= gl.getUniformLocation(program,"uLightDirection");
	gl.uniform3f(uLightDirection,-1.0,-1.0,-1.0);

	var uEyePosition= gl.getUniformLocation(program,"uEyePosition");
	gl.uniform3f(uEyePosition,1,1,1);

	var uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
	gl.uniform3f(uMaterialDiffuse,0.2,0.7,0.2);

	var uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
	gl.uniform3f(uLightDiffuse,1.0,1.0,1.0);

	var uMaterialAmbient = gl.getUniformLocation(program,"uMaterialAmbient");
	gl.uniform3f(uMaterialAmbient,0.0,0.5,0.0);

	var uLightAmbient = gl.getUniformLocation(program,"uLightAmbient");
	gl.uniform3f(uLightAmbient,0.3,0.3,0.3);

	var uMaterialSpecular = gl.getUniformLocation(program,"uMaterialSpecular");
	gl.uniform3f(uMaterialSpecular,0.9,1.0,0.9);

	var uLightSpecular = gl.getUniformLocation(program,"uLightSpecular");
	gl.uniform3f(uLightSpecular,1.0,1.0,1.0);

	var uShininess = gl.getUniformLocation(program,"uShininess");
	gl.uniform1f(uShininess,1000.0);

	var uEnableAmbient = gl.getUniformLocation(program,"uEnableAmbient");
	gl.uniform1i(uEnableAmbient,true);

	var uEnableDiffuse = gl.getUniformLocation(program,"uEnableDiffuse");
	gl.uniform1i(uEnableDiffuse,true);

	var uEnableSpecular = gl.getUniformLocation(program,"uEnableSpecular");
	gl.uniform1i(uEnableSpecular,true);

	/*
	var texture = gl.createTexture();
	var uSampler = gl.getUniformLocation(program, 'uSampler');
	var image = new Image();
	image.onload = function(){ 
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		// Enable texture unit0
		gl.activeTexture(gl.TEXTURE0);
		// Bind the texture object to the target
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		
		// Set the texture image
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		
		// Set the texture unit 0 to the sampler
		gl.uniform1i(uSampler, 0);
		
		//draw scene when the image has loaded  
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};
	image.src = 'flatmap1.jpg';
	*/

	//draw scene
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// remove this to draw at same scene
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}