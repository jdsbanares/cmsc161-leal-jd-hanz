	

		var image;
		function ceiling(x,y,z,rotatex,rotatey,rotatez) {
			var canvas = document.getElementById("c");
			var gl = initializeWebGL(canvas);
			var l=0.2, w=0.1, h=0.05;
			
			var vertexShader = initializeShader(gl,"vshader");
			var fragmentShader = initializeShader(gl, "fshader");
			var program = initializeProgram(gl,vertexShader,fragmentShader);
			gl.useProgram(program);
			

		  	var cube_vertices = [   // Coordinates
		     x+w,y+h,z+w,	x-w,y+h,z+w,	x-w,y-h,z+w,	x+w,y-h,z+w, //front
		     x+w,y+h,z+w,	x+w,y-h,z+w,	x+w,y-h,z-w,	x+w,y+h,z-w, //right
		     x+w,y+h,z+w,	x+w,y+h,z-w,	x-w,y+h,z-w,	x-w,y+h,z+w, //up
		     x-w,y+h,z+w,	x-w,y+h,z-w,	x-w,y-h,z-w,	x-w,y-h,z+w,//left
		     x-w,y-h,z-w,	x+w,y-h,z-w,	x+w,y-h,z+w,	x-w,y-h,z+w,//down
		     x+w,y-h,z-w,	x-w,y-h,z-w,	x-w,y+h,z-w,	x+w,y+h,z-w//back
		  	];
		  	//buffer creation
		  	var cubeVerticesBuffer = gl.createBuffer();
		  	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
		  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);
		  	//attribute variable mapping to buffer
		  	var aPosition = gl.getAttribLocation(program,"aPosition");
		  	gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
		  	gl.enableVertexAttribArray(aPosition);
		  	//unbind buffer to ARRAY_BUFFER POINTER
		  	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		  	
		  	// Indices of the vertices
			var indices = [
			 0, 1, 2,   0, 2, 3,    // front
			 4, 5, 6,   4, 6, 7,    // right
			 8, 9,10,   8,10,11,    // up
			12,13,14,  12,14,15,    // left
			16,17,18,  16,18,19,    // down
			20,21,22,  20,22,23     // back
			];
			//buffer creation
		  	var indexBuffer = gl.createBuffer();
		  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		  	//unbind buffer to gl.ELEMENT_ARRAY_BUFFER POINTER
		  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); 

		  	var tex_coords = [   // Coordinates
		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0,

		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0,

		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0,

		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0,

		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0,

		     1.0, 1.0,  
		     0.0, 1.0, 
		     0.0, 0.0, 
		     1.0, 0.0
		  	];
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
		  	//mat4.rotateX(modelMatrix,modelMatrix,glMatrix.toRadian(0));//??change rotation angle
		  	gl.uniformMatrix4fv(uModel,false,modelMatrix);

		  	var viewMatrix = mat4.create();
		  	var uView = gl.getUniformLocation(program,"uView");
		  	mat4.lookAt(viewMatrix,[-0.5,-0.5,2],[0,0,0],[0,1,0]);
		  	gl.uniformMatrix4fv(uView,false,viewMatrix);

		  	var projectionMatrix = mat4.create();
		  	var uProjection = gl.getUniformLocation(program,"uProjection");
		  	mat4.perspective(projectionMatrix,glMatrix.toRadian(30),canvas.width/canvas.height,1,100);
		  	gl.uniformMatrix4fv(uProjection,false,projectionMatrix);
		  	

		  	var texture = gl.createTexture();
		  	var uSampler = gl.getUniformLocation(program, 'uSampler');
  			var image = new Image(); 
  			var image1Ready = false;
			image.onload = function(){ 
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
				gl.generateMipmap(gl.TEXTURE_2D);

				gl.uniform1i(uSampler, 0);
				image1Ready = true;
			};
  			image.src = 'textures/4.jpg';

  			/*var isDragged = false;
  			var prevX = -1;
  			var prevY = -1;

  			var xRotation = 0;
  			var yRotation = 0;
  			canvas.onmousedown = function(ev) {
  				var canvasBounds = ev.target.getBoundingClientRect();
  				var currX = ev.clientX;
  				var currY = ev.clientY;
  				if (canvasBounds.left <= currX && currX < canvasBounds.right && canvasBounds.top <= currY && currX < canvasBounds.bottom) {
      				prevX = currX; 
      				prevY = currY;
      				isDragged = true;
    			}
  			};
  			canvas.onmouseup = function(ev) {
  				isDragged = false;
  			};
  			window.onmouseup = function(ev) {
  				isDragged = false;
  			};
  			canvas.onmousemove = function(ev) {
  				var currX = ev.clientX;
  				var currY = ev.clientY;

  				if(isDragged) {
  					var factor = 100/canvas.height; // The rotation ratio
      				var dx = factor * (currX - prevX);
      				var dy = factor * (currY - prevY);
      				xRotation += dy;
  					xRotation %= 360;
  					yRotation += dx;
  					yRotation %= 360;
  					//console.log(xRotation + " " + yRotation);
  			
  				}
  				prevX = currX; 
      			prevY = currY;
  			};*/

  			var animate = function() {
  				gl.clearColor(0, 0, 0, 1);
  				gl.enable(gl.DEPTH_TEST);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

				/*modelMatrix = mat4.identity(modelMatrix);
  				mat4.rotateX(modelMatrix,modelMatrix,glMatrix.toRadian(xRotation));
  				mat4.rotateY(modelMatrix,modelMatrix,glMatrix.toRadian(yRotation));
  				gl.uniformMatrix4fv(uModel,false,modelMatrix);*/
  				
  				if(image1Ready) {	
					mat4.scale(modelMatrix,modelMatrix,[1,1,1]);
					gl.uniformMatrix4fv(uModel,false,modelMatrix);		
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
					gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
					
				}
				
				requestAnimFrame(animate);
			}
			
			//start animation
			animate();
		}