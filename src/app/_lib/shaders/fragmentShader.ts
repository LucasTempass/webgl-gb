export const fragmentShaderContent = `#version 300 es
precision highp float;

in vec3 scaled_normal;
in vec3 position;
in vec2 texture_coords;

uniform float ka, kd, ks, q;
uniform vec3 light_position, light_color;
uniform sampler2D texture_buffer;

out vec4 fragment_color;

void main() {
    vec3 ambient = ka * light_color;

    vec3 N = normalize(scaled_normal);
    vec3 L = normalize(light_position - position);
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = kd * diff * light_color;

    vec3 R = normalize(reflect(-L, N));
    vec3 V = normalize(position);
    float spec = max(dot(R, V), 0.0);

    vec3 specular = ks * pow(spec, q) * light_color;

    vec4 texture_color = texture(texture_buffer, texture_coords);
    vec3 result = (ambient + diffuse) * vec3(texture_color) + specular;

    fragment_color = vec4(result, 1.0);
}`;
