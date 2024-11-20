export const vertexShaderContent = `#version 300 es
in vec3 base_position;
in vec3 base_color;
in vec3 base_normal;
in vec2 base_texcoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 color;
out vec3 scaled_normal;
out vec3 position;
out vec2 texture_coords;

void main() {
    gl_Position = projection * view * model * vec4(base_position, 1.0);
    texture_coords = vec2(base_texcoord.x, 1.0 - base_texcoord.y);
    // reduz para vec3 para facilitar cálculos no fragment shader
    scaled_normal = vec3(model * vec4(base_normal, 1.0));
    position = vec3(gl_Position);
}`;
