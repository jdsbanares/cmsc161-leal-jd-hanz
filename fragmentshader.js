precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uEyePosition;

uniform vec3 uMaterialAmbient;
uniform vec3 uLightAmbient;

uniform vec3 uMaterialDiffuse;
uniform vec3 uLightDiffuse;

uniform vec3 uMaterialSpecular;
uniform vec3 uLightSpecular;
uniform float uShininess;

uniform bool uEnableAmbient;
uniform bool uEnableDiffuse;
uniform bool uEnableSpecular;

uniform sampler2D uSampler;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoords;

void main() {
	vec3 ambientColor = vec3(0.0,0.0,0.0);
	vec3 diffuseColor = vec3(0.0,0.0,0.0);
	vec3 specularColor = vec3(0.0,0.0,0.0);
	
	vec3 normalized_aNormal = normalize(vNormal);

	vec3 normalized_uLightDirection = normalize(uLightDirection);
	vec3 eyeDirection = uEyePosition - vPosition;
	vec3 normalized_eyeDirection = normalize(eyeDirection);
	vec3 reflectDirection = reflect(normalized_uLightDirection,normalized_aNormal);
	vec3 normalized_reflectDirection = normalize(reflectDirection);
	//ambient
	if(uEnableAmbient) {
	ambientColor = uLightAmbient * uMaterialAmbient;
	}
	//diffuse
	if(uEnableDiffuse) {
	
	float lambertCoefficient = max(dot(-normalized_uLightDirection,normalized_aNormal),0.0);
	diffuseColor =  uLightDiffuse * uMaterialDiffuse * lambertCoefficient;
	}
	//specular
	if(uEnableSpecular) {
	
	float specularCoefficient = max(dot(normalized_reflectDirection,normalized_eyeDirection),0.0);
	specularCoefficient = pow(specularCoefficient,uShininess);
	specularColor =  uLightSpecular * uMaterialSpecular * specularCoefficient;
	//specularColor = vec3(1.0,1.0,1.0) * specularCoefficient;
	}

	vec4 finalColor = vec4(ambientColor+diffuseColor+specularColor,1.0);

	//gl_FragColor = finalColor;
	
	gl_FragColor = texture2D(uSampler, vTexCoords);
}