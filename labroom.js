function create_pc(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

var translateMatrix = [x, y, z];

		var pc_vertices = [
			0.0, 0.0, 0.0, 
			0.01, 0.0, -0.01,
			0.02, 0.0, 0.0,
			0.01, 0.01, -0.005, //center of triangle
			
			-0.04, 0.01, 0.0,
			-0.04, 0.06, 0.0,
			 0.06, 0.06, 0.0,
			 0.06, 0.01, 0.0,
			-0.04, 0.01, 0.01,
			-0.04, 0.06, 0.01,
			 0.06, 0.06, 0.01,
			 0.06, 0.01, 0.01,
			 
			-0.02, 0.0, 0.05,
			-0.02, 0.0, 0.01,
			 0.04, 0.0, 0.01,
			 0.04, 0.0, 0.05,
			 
			 0.07, 0.0, 0.03,
			 0.07, 0.01, 0.03,
			 0.09, 0.01, 0.03,
			 0.09, 0.0, 0.03,
			 0.07, 0.0, 0.0,
			 0.07, 0.01, 0.0,
			 0.09, 0.01, 0.0,
			 0.09, 0.0, 0.0

			 
		];

		var pcVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pcVerticesBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pc_vertices), gl.STATIC_DRAW);
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
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			
	  		 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,
			 0.0,  0.0, 1.0,

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
			0, 1, 3,
			0, 2, 3,
			1, 2, 3,
			
			4, 5, 6,
			4, 6, 7,
			4, 5, 8,
			5, 8, 9,
			4, 7, 8,
			7, 8, 11,
			5, 6, 9,
			6, 9, 10,
			6, 7, 11,
			6, 10, 11,
			8, 9, 10,
			8, 10, 11,
			
			12, 13, 14,
			12, 14, 15,
			
			16, 17, 18,
			16, 18, 19,
			16, 17, 20,
			17, 20, 21,
			16, 19, 20,
			19, 20, 23,
			17, 18, 21,
			18, 21, 22,
			18, 19, 23,
			18, 22, 23,
			20, 21, 22,
			20, 22, 23			
		];

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		/*var tex_coords = [   // Coordinates
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
		*/
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
		mat4.lookAt(viewMatrix,[1,0.25,1],[0,0.25,0],[0,2,0]);
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

function create_beaker(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){

	var image = new Image();
	image.onload = function(){ 
		var vertices = [   // Coordinates
		];
		var normals = [   // Normal of each vertex
		];
		var tex_coords = [
		];
		var max_stacks = 30;
		var max_slices = 30;
		var radius = 1;

		for (var stack = 0; stack <= max_stacks; stack++) {
			var theta = stack * Math.PI / max_stacks;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			for (var slices = 0; slices <= max_slices; slices++) {
				var phi = slices * 2 * Math.PI / max_slices;

				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);
				var x = cosPhi * sinTheta;
				var y = 1;
				var z = sinPhi * sinTheta;
				vertices.push(x * radius);
				vertices.push(y * radius);
				vertices.push(z * radius);
				normals.push(x);
				normals.push(y);
				normals.push(z);
				tex_coords.push(theta/ (2*Math.PI));
				tex_coords.push((y*radius + 1) / 2 );
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
				var y = -1;
				var z = sinPhi * sinTheta;
				vertices.push(x * radius);
				vertices.push(y * radius);
				vertices.push(z * radius);
				normals.push(x);
				normals.push(y);
				normals.push(z);
				tex_coords.push(theta/ (2*Math.PI));
				tex_coords.push((y*radius + 1) / 2 );
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

		for (var stack = max_stacks-1; stack < 2*max_stacks; stack++) {
			for (var slices = max_slices-1; slices < 2*max_slices; slices++) {
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

		var numofvertices = (vertices.length/3)/2

		for (var stack = 0; stack < numofvertices ; stack++) {

		  var topleft = stack;
		  if(stack == numofvertices-1) var topleft = 0;
		  var bottomleft = numofvertices + topleft;
		  var topright = topleft + 1;
		  var bottomright = bottomleft + 1;

		  indices.push(topleft);
		  indices.push(topright);
		  indices.push(bottomleft);

		  indices.push(topright);
		  indices.push(bottomright);
		  indices.push(bottomleft);
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
		mat4.lookAt(viewMatrix,[2,2,7],[0,-1,0],[0,1,0]);
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
		gl.uniform3f(uEyePosition,2,2,7);

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
	image.src = 'textures/13.jpg';

}