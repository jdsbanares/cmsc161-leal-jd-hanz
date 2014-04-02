function create_lab_room_table(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){
	create_table(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
}

function create_tesla_coil(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){
	create_sphere(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
	create_cylinder(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ);
}

function create_table(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 

		// Coordinates
		var vertices = [
			0.0,  0.0,  0.0, //0
			0.5,  0.0,  0.0,
			0.5,  0.0,  0.25,
			0.0,  0.0,  0.25,
			0.0,  0.2,  0.0, //0
			0.5,  0.2,  0.0,
			0.5,  0.2,  0.25,
			0.0,  0.2,  0.25,
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
	image.src = 'textures/2.jpg';
}

function create_cylinder(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ) {
	var image = new Image();
	// Register the event handler to be called on loading an image
	image.onload = function(){

	var vertices = [   // Coordinates
  	];
  	var tex_coords = [   // Coordinates
  	];
  	var normals = [   // Normal of each vertex
  	];
	 var max_stacks = 30;
		 var max_slices = 30;
		 var radius = 0.1;


		 for (var stack = 0; stack <= max_stacks; stack++) {
			var theta = stack * Math.PI / max_stacks;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			for (var slices = 0; slices <= max_slices; slices++) {
		    var phi = slices * 2 * Math.PI / max_slices;

		    var sinPhi = Math.sin(phi);
		    var cosPhi = Math.cos(phi);
		    var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				vertices.push(x * radius);
				vertices.push(1);
				vertices.push(z * radius);
				normals.push(x);
				normals.push(1);
				normals.push(z);
				tex_coords.push(1 - (slices/max_slices));
				tex_coords.push(1 - (stack/max_stacks));
		}

	}


	 for (var stack = 0; stack <= max_stacks; stack++) {
			var theta = stack * Math.PI / max_stacks;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			for (var slices = 0; slices <= max_slices; slices++) {
		    var phi = slices * 2 * Math.PI / max_slices;

		    var sinPhi = Math.sin(phi);
		    var cosPhi = Math.cos(phi);
		    var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				vertices.push(x * radius);
				vertices.push(-0.25);
				vertices.push(z * radius);
				normals.push(x);
				normals.push(-0.25);
				normals.push(z);
				tex_coords.push(1 - (slices/max_slices));
				tex_coords.push(1 - (stack/max_stacks));
		}

	}


		  	// Indices of the vertices
	var indices = [
	];
	
	
	 for (var stack = max_stacks; stack < max_stacks*2; stack++) {
			for (var slices = max_slices-1; slices < max_slices*2; slices++) {
	        var topleft = (stack * (max_slices + 1)) + slices;
	        var bottomleft = topleft + max_slices + 1;
	        var topright = topleft + 1;
	        var bottomright = bottomleft + 1;
	        indices.push(topleft);
	        indices.push(bottomleft);
	        indices.push(topright);
	        indices.push(bottomleft);
	        indices.push(bottomright);
	        indices.push(topright);
			}
	}

	 for (var stack = 0; stack < max_stacks; stack++) {
			for (var slices = 0; slices < max_slices; slices++) {
	        var topleft = (stack * (max_slices + 1)) + slices;
	        var bottomleft = topleft + max_slices + 1;
	        var topright = topleft + 1;
	        var bottomright = bottomleft + 1;
	        indices.push(topleft);
	        indices.push(bottomleft);
	        indices.push(topright);
	        indices.push(bottomleft);
	        indices.push(bottomright);
	        indices.push(topright);
			}
	}

	var point = (vertices.length/3)/2;

	 for (var i = 0; i < point; i++) {
	        var topleft = i;
	       	var bottomleft = i+point;

	        if(i == point-1){
	        	var topright = 0;
	        	var bottomright = 0;
	        }
	        else{
	        	
	        	var topright = i+1;
	        	var bottomright = i+point+1;
	    	}
	        indices.push(topleft);
	        indices.push(bottomleft);
	        indices.push(topright);
	        indices.push(bottomleft);
	        indices.push(bottomright);
	        indices.push(topright);
	}
	
  	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  	//attribute variable mapping to buffer
  	var aPosition = gl.getAttribLocation(program,"aPosition");
  	gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
  	gl.enableVertexAttribArray(aPosition);
  	//unbind buffer to ARRAY_BUFFER POINTER
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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
	mat4.lookAt(viewMatrix,[3,3,7],[0,0,0],[0,1,0]);
	gl.uniformMatrix4fv(uView,false,viewMatrix);

	var projectionMatrix = mat4.create();
	var uProjection = gl.getUniformLocation(program,"uProjection");
	mat4.perspective(projectionMatrix,glMatrix.toRadian(30),canvas.width/canvas.height,1,100);
	//mat4.ortho(projectionMatrix,2,2,2,2,1,5);
	gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

	//set-up light and material parameters

	var uLightDirection= gl.getUniformLocation(program,"uLightDirection");
	gl.uniform3f(uLightDirection,-1.0,-0.5,-5.0);

	var uEyePosition= gl.getUniformLocation(program,"uEyePosition");
	gl.uniform3f(uEyePosition,3,3,7);

	var uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
	gl.uniform3f(uMaterialDiffuse,0.2,0.2,0.2);

	var uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
	gl.uniform3f(uLightDiffuse,0.5,0.5,0.5);

	var uMaterialAmbient = gl.getUniformLocation(program,"uMaterialAmbient");
	gl.uniform3f(uMaterialAmbient,1.0,1.0,1.0);

	var uLightAmbient = gl.getUniformLocation(program,"uLightAmbient");
	gl.uniform3f(uLightAmbient,1.0,1.0,1.0);

	var uMaterialSpecular = gl.getUniformLocation(program,"uMaterialSpecular");
	gl.uniform3f(uMaterialSpecular,0.9,1.0,0.9);

	var uLightSpecular = gl.getUniformLocation(program,"uLightSpecular");
	gl.uniform3f(uLightSpecular,1.0,1.0,1.0);

	var uShininess = gl.getUniformLocation(program,"uShininess");
	gl.uniform1f(uShininess,100000.0);
	
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
	image.src = 'textures/17.jpg';
}

function create_sphere(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ) {

	var image = new Image();
	// Register the event handler to be called on loading an image
	image.onload = function(){

	var vertices = [   // Coordinates
  	];
	var tex_coords = [   // Coordinates
  	];
  	var normals = [   // Normal of each vertex
  	];
	 var max_stacks = 30;
		 var max_slices = 30;
		 var radius = 0.4;

		 for (var stack = 0; stack <= max_stacks; stack++) {
			var theta = stack * Math.PI / max_stacks;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			for (var slices = 0; slices <= max_slices; slices++) {
		    var phi = slices * 2 * Math.PI / max_slices;

		    var sinPhi = Math.sin(phi);
		    var cosPhi = Math.cos(phi);
		    var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				vertices.push(x * radius);
				vertices.push(y/2 * radius);
				vertices.push(z * radius);
				normals.push(x);
				normals.push(y);
				normals.push(z);
			tex_coords.push(1 - (slices/max_slices));
			tex_coords.push(1 - (stack/max_stacks));
		}
	}

  	// Indices of the vertices
	var indices = [
	];
	 for (var stack = 0; stack < max_stacks; stack++) {
			for (var slices = 0; slices < max_slices; slices++) {
	        var topleft = (stack * (max_slices + 1)) + slices;
	        var bottomleft = topleft + max_slices + 1;
	        var topright = topleft + 1;
	        var bottomright = bottomleft + 1;
	        indices.push(topleft);
	        indices.push(bottomleft);
	        indices.push(topright);
	        indices.push(bottomleft);
	        indices.push(bottomright);
	        indices.push(topright);
			}
	}
	
  	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  	//attribute variable mapping to buffer
  	var aPosition = gl.getAttribLocation(program,"aPosition");
  	gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
  	gl.enableVertexAttribArray(aPosition);
  	//unbind buffer to ARRAY_BUFFER POINTER
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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
			  					
	var modelMatrix = mat4.create();
	var uModel = gl.getUniformLocation(program,"uModel");
	mat4.translate(modelMatrix,modelMatrix,[x,y+1,z]);
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
	mat4.lookAt(viewMatrix,[3,3,7],[0,0,0],[0,1,0]);
	gl.uniformMatrix4fv(uView,false,viewMatrix);

	var projectionMatrix = mat4.create();
	var uProjection = gl.getUniformLocation(program,"uProjection");
	mat4.perspective(projectionMatrix,glMatrix.toRadian(30),canvas.width/canvas.height,1,100);
	//mat4.ortho(projectionMatrix,2,2,2,2,1,5);
	gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

	//set-up light and material parameters

	var uLightDirection= gl.getUniformLocation(program,"uLightDirection");
	gl.uniform3f(uLightDirection,-1.0,-0.5,-5.0);

	var uEyePosition= gl.getUniformLocation(program,"uEyePosition");
	gl.uniform3f(uEyePosition,3,3,7);

	var uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
	gl.uniform3f(uMaterialDiffuse,0.2,0.2,0.2);

	var uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
	gl.uniform3f(uLightDiffuse,0.5,0.5,0.5);

	var uMaterialAmbient = gl.getUniformLocation(program,"uMaterialAmbient");
	gl.uniform3f(uMaterialAmbient,1.0,1.0,1.0);

	var uLightAmbient = gl.getUniformLocation(program,"uLightAmbient");
	gl.uniform3f(uLightAmbient,1.0,1.0,1.0);

	var uMaterialSpecular = gl.getUniformLocation(program,"uMaterialSpecular");
	gl.uniform3f(uMaterialSpecular,0.9,1.0,0.9);

	var uLightSpecular = gl.getUniformLocation(program,"uLightSpecular");
	gl.uniform3f(uLightSpecular,1.0,1.0,1.0);

	var uShininess = gl.getUniformLocation(program,"uShininess");
	gl.uniform1f(uShininess,100000.0);
	
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
	image.src = 'textures/2.jpg';
}