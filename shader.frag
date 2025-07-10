#ifdef GL_ES

precision lowp float;

#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

float time;

float noise(vec2 p)
{
    return sin(p.x*10.) * sin(p.y*(3. + sin(time/11.))) + .2;
}

mat2 rotate(float angle)
{
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float fbm(vec2 p)
{
    p *= 1.1;
    float f = 0.;
    float amp = .5;
    for( int i = 0; i < 3; i++) {
        mat2 modify = rotate(time/50. * float(i*i));
        f += amp*noise(p);
        p = modify * p;
        p *= 2.;
        amp /= 2.2;
    }
    return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
    vec2 mouseOffset = (iMouse - 0.5) * 0.6;
    float mouseInfluence = length(mouseOffset) * 0.2;
    vec2 modifiedP = p + mouseOffset * 0.08;
    q = vec2( fbm(modifiedP + vec2(0.)), fbm(rotate(.6*time + mouseInfluence*0.3)*modifiedP + vec2(1.)));
    r = vec2( fbm(rotate(0.1 + mouseInfluence*0.2)*q + vec2(0.)), fbm(q + vec2(8.)));
    return fbm(modifiedP + 0.666*r);
}

float digit(vec2 p){
    vec2 grid = vec2(6.6,6.) * 11.;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q;
    vec2 r;
    float intensity = pattern(s/10., q, r)*1.3 - 0.03 ;
    p = fract(p);
    p *= vec2(1.2, 1.2);
    float x = fract(p.x * 5.);
    float y = fract((1. - p.y) * 5.);
    int i = int(floor((1. - p.y) * 5.));
    int j = int(floor(p.x * 5.));
    int n = (i-2)*(i-2)+(j-2)*(j-2);
    float f = float(n)/16.;
    float isOn = intensity - f > 0.1 ? 1. : 0.;
    return p.x <= 1. && p.y <= 1. ? isOn * (0.2 + y*4./5.) * (0.75 + x/4.) : 0.;
}

float hash(float x){
    return fract(sin(x*234.1)* 324.19 + sin(sin(x*3214.09) * 34.132 * x) + x * 234.12);
}

float onOff(float a, float b, float c)
{
    return step(c, sin(iTime + a*cos(iTime*b)));
}

vec3 getColor(vec2 p){
    float colorCycle = time * 2.0;
    vec3 cyclingColor = vec3(
        0.5 + 0.5 * sin(colorCycle  + 2.094),
        0.5 + 0.5 * sin(colorCycle + 4.188),
        0.5 + 0.5 * sin(colorCycle)
    );
    cyclingColor = clamp(cyclingColor, 0.3, 0.8);
    vec2 mouseOffset = (iMouse - 0.5) * 0.2;
    vec2 modifiedP = p + mouseOffset * 0.03 * sin(time * 1.0);
    float bar = mod(modifiedP.y + time*20., 1.) < 1.2 ?  1.4  : 1.;
    float middle = digit(modifiedP);
    float off = 0.005;
    float sum = 0.;
    for (float i = -1.; i < 2.; i+=1.){
        for (float j = -1.; j < 2.; j+=1.){
            sum += digit(modifiedP+vec2(off*i, off*j));
        }
    }
    vec3 basePattern = vec3(0.7)*middle + sum/1.*vec3(1.0) * bar;
    vec3 finalColor = basePattern * cyclingColor * 0.85;
    return finalColor;
}

void main() {
    time = iTime / 6.66;
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    vec2 mouseOffset = (iMouse - 0.5) * 0.3;
    float mouseInfluence = length(mouseOffset) * 0.05;
    vec2 center = p - 0.5;
    float distanceFromCenter = length(center);
    p += center * mouseInfluence * 0.02 * sin(time * 1.5 + distanceFromCenter * 5.0);
    float off = 0.0001;
    vec3 col = getColor(p);
    gl_FragColor = vec4(col,1.00);
}
