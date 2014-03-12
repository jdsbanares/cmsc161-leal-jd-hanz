function full_wall(gl, program, canvas, x, y, z, rotateX, rotateY, rotateZ){
					
					var translateMatrix = [x, y, z];
					
					var full_wall_vertices = [
						0.0, 0.0, 0.0,
						0.1, 0.0, 0.0,
						0.0, 0.0, 0.05,
						0.1, 0.0, 0.05,
						0.0, 0.6, 0.0,
						0.1, 0.6, 0.0,
						0.0, 0.6, 0.05,
						0.1, 0.6, 0.05
					];
					
					var fullWallVerticesBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, fullWallVerticesBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(full_wall_vertices), gl.STATIC_DRAW);
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
					mat4.lookAt(viewMatrix,[3,3,7],[0,0,0],[0,1,0]);
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
					image.src = 'textures/1.jpg';
					
					gl.clearColor(0, 0, 0, 1);
					gl.enable(gl.DEPTH_TEST);
					//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
					gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);   

				}