attribute vec3 aPosition;
attribute vec2 aTexCoords;
attribute vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uNormal;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoords;

void main() {
	gl_Position = uProjection * uView * uModel * vec4(aPosition,1.0);
	
	vec3 vertexPosition = vec3(uModel * vec4(aPosition,1.0)); 
	vec3 corrected_aNormal = vec3(uNormal * vec4(aNormal,1.0));

	vPosition =  vertexPosition;
	vNormal = corrected_aNormal;
	
	vTexCoords = aTexCoords;			
}