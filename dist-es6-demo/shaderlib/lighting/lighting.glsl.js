// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// lighting

export default "#define NUM_OF_LIGHTS 2\nuniform vec3 cameraPos;\nuniform vec3 lightsPosition[16];\nuniform vec2 lightsStrength[16];\nuniform float ambientRatio;\nuniform float diffuseRatio;\nuniform float specularRatio;\n\nfloat getLightWeight(vec3 position_worldspace_vec3, vec3 normals_worldspace) {\n  float lightWeight = 0.0;\n\n  vec3 normals_worldspace_vec3 = normals_worldspace.xzy;\n\n  vec3 camera_pos_worldspace = cameraPos;\n  vec3 view_direction = normalize(camera_pos_worldspace - position_worldspace_vec3);\n\n  for (int i = 0; i < NUM_OF_LIGHTS; i++) {\n    vec3 light_position_worldspace = project_position(lightsPosition[i]);\n    vec3 light_direction = normalize(light_position_worldspace - position_worldspace_vec3);\n\n    vec3 halfway_direction = normalize(light_direction + view_direction);\n    float lambertian = dot(light_direction, normals_worldspace_vec3);\n    float specular = 0.0;\n    if (lambertian > 0.0) {\n      float specular_angle = max(dot(normals_worldspace_vec3, halfway_direction), 0.0);\n      specular = pow(specular_angle, 32.0);\n    }\n    lambertian = max(lambertian, 0.0);\n    lightWeight += (ambientRatio + lambertian * diffuseRatio + specular * specularRatio) *\n      lightsStrength[i].x;\n\n  }\n\n  return lightWeight;\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvbGlnaHRpbmcvbGlnaHRpbmcuZ2xzbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSIsImZpbGUiOiJsaWdodGluZy5nbHNsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIGxpZ2h0aW5nXG5cbmV4cG9ydCBkZWZhdWx0IGBcXFxuI2RlZmluZSBOVU1fT0ZfTElHSFRTIDJcbnVuaWZvcm0gdmVjMyBjYW1lcmFQb3M7XG51bmlmb3JtIHZlYzMgbGlnaHRzUG9zaXRpb25bMTZdO1xudW5pZm9ybSB2ZWMyIGxpZ2h0c1N0cmVuZ3RoWzE2XTtcbnVuaWZvcm0gZmxvYXQgYW1iaWVudFJhdGlvO1xudW5pZm9ybSBmbG9hdCBkaWZmdXNlUmF0aW87XG51bmlmb3JtIGZsb2F0IHNwZWN1bGFyUmF0aW87XG5cbmZsb2F0IGdldExpZ2h0V2VpZ2h0KHZlYzMgcG9zaXRpb25fd29ybGRzcGFjZV92ZWMzLCB2ZWMzIG5vcm1hbHNfd29ybGRzcGFjZSkge1xuICBmbG9hdCBsaWdodFdlaWdodCA9IDAuMDtcblxuICB2ZWMzIG5vcm1hbHNfd29ybGRzcGFjZV92ZWMzID0gbm9ybWFsc193b3JsZHNwYWNlLnh6eTtcblxuICB2ZWMzIGNhbWVyYV9wb3Nfd29ybGRzcGFjZSA9IGNhbWVyYVBvcztcbiAgdmVjMyB2aWV3X2RpcmVjdGlvbiA9IG5vcm1hbGl6ZShjYW1lcmFfcG9zX3dvcmxkc3BhY2UgLSBwb3NpdGlvbl93b3JsZHNwYWNlX3ZlYzMpO1xuXG4gIGZvciAoaW50IGkgPSAwOyBpIDwgTlVNX09GX0xJR0hUUzsgaSsrKSB7XG4gICAgdmVjMyBsaWdodF9wb3NpdGlvbl93b3JsZHNwYWNlID0gcHJvamVjdF9wb3NpdGlvbihsaWdodHNQb3NpdGlvbltpXSk7XG4gICAgdmVjMyBsaWdodF9kaXJlY3Rpb24gPSBub3JtYWxpemUobGlnaHRfcG9zaXRpb25fd29ybGRzcGFjZSAtIHBvc2l0aW9uX3dvcmxkc3BhY2VfdmVjMyk7XG5cbiAgICB2ZWMzIGhhbGZ3YXlfZGlyZWN0aW9uID0gbm9ybWFsaXplKGxpZ2h0X2RpcmVjdGlvbiArIHZpZXdfZGlyZWN0aW9uKTtcbiAgICBmbG9hdCBsYW1iZXJ0aWFuID0gZG90KGxpZ2h0X2RpcmVjdGlvbiwgbm9ybWFsc193b3JsZHNwYWNlX3ZlYzMpO1xuICAgIGZsb2F0IHNwZWN1bGFyID0gMC4wO1xuICAgIGlmIChsYW1iZXJ0aWFuID4gMC4wKSB7XG4gICAgICBmbG9hdCBzcGVjdWxhcl9hbmdsZSA9IG1heChkb3Qobm9ybWFsc193b3JsZHNwYWNlX3ZlYzMsIGhhbGZ3YXlfZGlyZWN0aW9uKSwgMC4wKTtcbiAgICAgIHNwZWN1bGFyID0gcG93KHNwZWN1bGFyX2FuZ2xlLCAzMi4wKTtcbiAgICB9XG4gICAgbGFtYmVydGlhbiA9IG1heChsYW1iZXJ0aWFuLCAwLjApO1xuICAgIGxpZ2h0V2VpZ2h0ICs9IChhbWJpZW50UmF0aW8gKyBsYW1iZXJ0aWFuICogZGlmZnVzZVJhdGlvICsgc3BlY3VsYXIgKiBzcGVjdWxhclJhdGlvKSAqXG4gICAgICBsaWdodHNTdHJlbmd0aFtpXS54O1xuXG4gIH1cblxuICByZXR1cm4gbGlnaHRXZWlnaHQ7XG59XG5gO1xuIl19