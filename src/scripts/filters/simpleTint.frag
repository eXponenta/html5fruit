precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec3 color;

void main(void)
{
   float a = texture2D(uSampler, vTextureCoord).a;
   vec3 rgb = texture2D(uSampler, vTextureCoord).rgb;
   vec3 W = vec3(0.2125, 0.7154, 0.0721);
   float intensity = dot(rgb, W);

   gl_FragColor.rgb = mix(color.rgb * a, rgb, intensity);
   gl_FragColor.a = a;
}