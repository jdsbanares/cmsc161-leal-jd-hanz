function create_sofa(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){
	create_sofa_armrest(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
	create_sofa_seat(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
	create_sofa_armrest(gl, program, canvas, x+0.8, y, z, rotateX, rotateY, rotateZ);
}

function create_sofa_armrest(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 
		// Coordinates
		var vertices = [
			 0.00,  0.00,  0.00,	// 0
			 0.00,  0.00, -0.30,	// 1
			 0.10,  0.00, -0.30,	// 2
			 0.10,  0.00,  0.00,	// 3
			 0.00,  0.20,  0.00,	// 4
			 0.00,  0.20, -0.30,	// 5
			 0.10,  0.20, -0.30,	// 6
			 0.10,  0.20,  0.00	// 7
		];

		// Normal of each vertex
		var normals = [
			 0.0,  0.0,  1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0,  1.0,
			 0.0,  0.0,  1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0,  1.0
		];

		// Indices of the vertices
		var indices = [
			// 10
			 0,  1,  2,
			 0,  2,  3,
			 4,  5,  6,
			 4,  6,  7,
			 0,  1,  5,
			 0,  5,  4,
			 2,  3,  7,
			 2,  7,  6,
			 0,  3,  7,
			 0,  7,  4,
			 1,  5,  6,
			 1,  6,  2
		];

		// Coordinates
		var tex_coords = [
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//front
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//right
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//up
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//left
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//down
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0	//back
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

		//set-up model matrix, view matrix, and projection matrix
		var modelMatrix = mat4.create();
		var uModel = gl.getUniformLocation(program,"uModel");
		mat4.translate(modelMatrix,modelMatrix,[x,y,z]);
		mat4.rotateX(modelMatrix,modelMatrix,rotateX);
		mat4.rotateY(modelMatrix,modelMatrix,rotateY);
		mat4.rotateZ(modelMatrix,modelMatrix,rotateZ);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);

		//add normal matrix
		var normalMatrix = mat4.create();
		var uNormal = gl.getUniformLocation(program,"uNormal");
		mat4.invert(normalMatrix,modelMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		gl.uniformMatrix4fv(uNormal,false,normalMatrix);

		var viewMatrix = mat4.create();
		var uView = gl.getUniformLocation(program,"uView");
		mat4.lookAt(viewMatrix,[2,2,2],[0,0,0],[0,1,0]);
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

		var texture = gl.createTexture();
		var uSampler = gl.getUniformLocation(program, 'uSampler');

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(uSampler, 0);

		//draw scene when the image has loaded  
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};
	image.src = 'textures/11.jpg';

}

function create_sofa_seat(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 
		// Coordinates
		var vertices = [
			 0.10,  0.00,  0.00,	// 0
			 0.10,  0.00, -0.30,	// 1
			 0.80,  0.00, -0.30,	// 2
			 0.80,  0.00,  0.00,	// 3
			 0.10,  0.15,  0.00,	// 4
			 0.80,  0.15,  0.00,	// 5
			 0.10,  0.15, -0.20,	// 6
			 0.80,  0.15, -0.20,	// 7
			 0.10,  0.30, -0.20,	// 8
			 0.80,  0.30, -0.20,	// 9
			 0.10,  0.30, -0.30,	// 10
			 0.80,  0.30, -0.30	// 11
		];

		// Normal of each vertex
		var normals = [
			 0.0,  0.0,  1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0,  1.0,
			 0.0,  0.0,  1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0,  1.0,

			 0.0,  0.0,  1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0, -1.0,
			 0.0,  0.0,  1.0
		];

		// Indices of the vertices
		var indices = [
			 0,  1,  2,
			 0,  2,  3,
			 4,  6,  7,
			 4,  7,  5,
			 8, 10, 11,
			 8, 11,  9,
			 0,  4,  5,
			 0,  5,  3,
			 6,  8,  9,
			 6,  9,  7,
			 1, 10, 11,
			 1, 11,  2,
			 1, 10,  8,
			 1,  8,  6,
			 1,  6,  4,
			 1,  4,  0,
			 2, 11,  9,
			 2,  9,  7,
			 2,  7,  5,
			 2,  5,  3
		];

		// Coordinates
		var tex_coords = [
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//front
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//right
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//up
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//left
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//down
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0	//back
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

		//set-up model matrix, view matrix, and projection matrix
		var modelMatrix = mat4.create();
		var uModel = gl.getUniformLocation(program,"uModel");
		mat4.translate(modelMatrix,modelMatrix,[x,y,z]);
		mat4.rotateX(modelMatrix,modelMatrix,rotateX);
		mat4.rotateY(modelMatrix,modelMatrix,rotateY);
		mat4.rotateZ(modelMatrix,modelMatrix,rotateZ);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);

		//add normal matrix
		var normalMatrix = mat4.create();
		var uNormal = gl.getUniformLocation(program,"uNormal");
		mat4.invert(normalMatrix,modelMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		gl.uniformMatrix4fv(uNormal,false,normalMatrix);

		var viewMatrix = mat4.create();
		var uView = gl.getUniformLocation(program,"uView");
		mat4.lookAt(viewMatrix,[2,2,2],[0,0,0],[0,1,0]);
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

		var texture = gl.createTexture();
		var uSampler = gl.getUniformLocation(program, 'uSampler');

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(uSampler, 0);

		//draw scene when the image has loaded  
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};
	image.src = 'textures/11.jpg';

}

function create_flat_screen_tv(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

var translateMatrix = [x, y, z];

		var tv_vertices = [
			0.0, 0.0, 0.0,
			0.3, 0.0, 0.0,
			0.0, 0.0, 0.005,
			0.3, 0.0, 0.005,
			0.0, 0.2, 0.0,
			0.3, 0.2, 0.0,
			0.0, 0.2, 0.005,
			0.3, 0.2, 0.005
		];

		var tvVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tvVerticesBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv_vertices), gl.STATIC_DRAW);
		var aPosition = gl.getAttribLocation(program,"aPosition");
		gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(aPosition);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		var normals = [
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0
		];

		var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		var aNormal = gl.getAttribLocation(program,"aNormal");
		gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(aNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		var indices = [
			0, 1, 2,
			1, 2, 3,

			0, 4, 6,
			0, 2, 6,

			0, 4, 1,
			4, 1, 5,

			1, 5, 3,
			5, 3, 7,

			3, 7, 2,
			7, 2, 6,

			6, 4, 7,
			4, 7, 5
		];

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		var tex_coords = [   // Coordinates
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//front
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//right
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//up
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//left
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//down
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0	//back
		];

		var texCoordsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
		var aTexCoords = gl.getAttribLocation(program,"aTexCoords");
		gl.vertexAttribPointer(aTexCoords,2,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(aTexCoords);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		var modelMatrix = mat4.create();
		var uModel = gl.getUniformLocation(program,"uModel");
		mat4.translate(modelMatrix, modelMatrix, translateMatrix);
		mat4.rotateX(modelMatrix,modelMatrix,glMatrix.toRadian(rotateX));
		mat4.rotateY(modelMatrix,modelMatrix,glMatrix.toRadian(rotateY));
		mat4.rotateZ(modelMatrix,modelMatrix,glMatrix.toRadian(rotateZ));
		gl.uniformMatrix4fv(uModel,false,modelMatrix);

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
		gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

		var uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
		gl.uniform3f(uMaterialDiffuse,0.0,1.0,0.0);

		var uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
		gl.uniform3f(uLightDiffuse,1.0,1.0,1.0);

		var uLightPosition= gl.getUniformLocation(program,"uLightPosition");
		gl.uniform3f(uLightPosition,2.0,2.0,2.0);

		var uLightDirection= gl.getUniformLocation(program,"uLightDirection");
		gl.uniform3f(uLightDirection, x, 0.0, z);

		/*
		var texture = gl.createTexture();
		var uSampler = gl.getUniformLocation(program, 'uSampler');
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);

		gl.uniform1i(uSampler, 0);
		image1Ready = true;*/
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);

		gl.uniformMatrix4fv(uModel,false,modelMatrix);		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function create_lounge_table(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){
	create_table_top(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
	create_table_foot(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
	create_table_foot(gl, program, canvas, x+0.375, y, z, rotateX, rotateY, rotateZ);
	create_table_foot(gl, program, canvas, x+0.375, y, z+0.375, rotateX, rotateY, rotateZ);
	create_table_foot(gl, program, canvas, x, y, z+0.375, rotateX, rotateY, rotateZ);
}


function create_table_foot(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 

		// Coordinates
		var vertices = [
			0.0,  -0.05,  0.0,//0
			0.025,  -0.05,  0.0,//1
			0.025,  -0.05,  0.025,//2
			0.0,  -0.05, 0.025,//3

			0.0,  -0.2,  0.0,//4
			0.025,  -0.2,  0.0,//5
			0.025,  -0.2,  0.025,//6
			0.0,  -	0.2, 0.025//7

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
			 0.0,  0.0,  1.0
		];

		// Indices of the vertices
		var indices = [
			0, 1, 3,
			3, 1, 2,
			4, 5, 7,
			7, 5, 6,
			3, 2, 7,
			7, 2, 6,
			0, 1, 4,
			4, 1, 5,
			0, 3, 4,
			4, 3, 7,
			2, 1, 6,
			6, 1, 5
		];

		// Coordinates
		var tex_coords = [
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//front
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//right
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//up
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//left
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//down
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0	//back
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


		//set-up model matrix, view matrix, and projection matrix
		var modelMatrix = mat4.create();
		var uModel = gl.getUniformLocation(program,"uModel");
		mat4.translate(modelMatrix,modelMatrix,[x,y,z]);
		mat4.rotateX(modelMatrix,modelMatrix,rotateX);
		mat4.rotateY(modelMatrix,modelMatrix,rotateY);
		mat4.rotateZ(modelMatrix,modelMatrix,rotateZ);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);

		//add normal matrix
		var normalMatrix = mat4.create();
		var uNormal = gl.getUniformLocation(program,"uNormal");
		mat4.invert(normalMatrix,modelMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		gl.uniformMatrix4fv(uNormal,false,normalMatrix);

		var viewMatrix = mat4.create();
		var uView = gl.getUniformLocation(program,"uView");
		mat4.lookAt(viewMatrix,[1,0.25,2.5],[0,0.25,0],[0,1,0]);
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

		var texture = gl.createTexture();
		var uSampler = gl.getUniformLocation(program, 'uSampler');

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(uSampler, 0);

		//draw scene when the image has loaded  
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};
	image.src = 'textures/14.jpg';

}


function create_table_top(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 

		// Coordinates
		var vertices = [
			0.0,  0.0,  0.0, //0
			0.4,  0.0,  0.0,//1
			0.4,  0.0,  0.4,//2
			0.0,  0.0,  0.4,//3
			0.0,  -0.05,  0.0,//4
			0.4,  -0.05,  0.0,//5
			0.4,  -0.05,  0.4,//6
			0.0,  -0.05,  0.4,//7
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
			 0.0,  0.0,  1.0
		];

		// Indices of the vertices
		var indices = [
			0, 1, 3,
			3, 1, 2,
			4, 5, 7,
			7, 5, 6,
			3, 2, 7,
			7, 2, 6,
			0, 1, 4,
			4, 1, 5,
			0, 3, 4,
			4, 3, 7,
			2, 1, 6,
			6, 1, 5
		];

		// Coordinates
		var tex_coords = [
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//front
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//right
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//up
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//left
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0,	//down
			1.0, 1.0,	0.0, 1.0,	0.0, 0.0,	1.0, 0.0	//back
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


		//set-up model matrix, view matrix, and projection matrix
		var modelMatrix = mat4.create();
		var uModel = gl.getUniformLocation(program,"uModel");
		mat4.translate(modelMatrix,modelMatrix,[x,y,z]);
		mat4.rotateX(modelMatrix,modelMatrix,rotateX);
		mat4.rotateY(modelMatrix,modelMatrix,rotateY);
		mat4.rotateZ(modelMatrix,modelMatrix,rotateZ);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);

		//add normal matrix
		var normalMatrix = mat4.create();
		var uNormal = gl.getUniformLocation(program,"uNormal");
		mat4.invert(normalMatrix,modelMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		gl.uniformMatrix4fv(uNormal,false,normalMatrix);

		var viewMatrix = mat4.create();
		var uView = gl.getUniformLocation(program,"uView");
		mat4.lookAt(viewMatrix,[1,0.25,2.5],[0,0.25,0],[0,1,0]);
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

		var texture = gl.createTexture();
		var uSampler = gl.getUniformLocation(program, 'uSampler');

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(uSampler, 0);

		//draw scene when the image has loaded  
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.uniformMatrix4fv(uModel,false,modelMatrix);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};
	image.src = 'textures/14.jpg';

}