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

export default "#define SHADER_NAME hexagon-cell-layer-vertex-shader-64\n\nattribute vec3 positions;\nattribute vec3 normals;\n\nattribute vec3 instancePositions;\nattribute vec2 instancePositions64xyLow;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\n// Picking uniforms\n// Set to 1.0 if rendering picking buffer, 0.0 if rendering for display\nuniform float renderPickingBuffer;\nuniform vec3 selectedPickingColor;\n\n// Custom uniforms\nuniform float opacity;\nuniform float radius;\nuniform float angle;\nuniform float extruded;\nuniform float coverage;\nuniform float elevationScale;\n\n// Result\nvarying vec4 vColor;\n\n// A magic number to scale elevation so that 1 unit approximate to 1 meter.\n#define ELEVATION_SCALE 0.8\n\nfloat isPicked(vec3 pickingColors, vec3 selectedColor) {\n return float(pickingColors.x == selectedColor.x\n && pickingColors.y == selectedColor.y\n && pickingColors.z == selectedColor.z);\n}\n\nvoid main(void) {\n\n  // rotate primitive position and normal\n  mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n\n  vec2 rPos = rotationMatrix * positions.xz;\n  vec2 rNorm = rotationMatrix * normals.xz;\n\n  vec3 rotatedPositions = vec3(rPos.x, positions.y, rPos.y);\n  vec3 rotatedNormals = vec3(rNorm.x, normals.y, rNorm.y);\n\n  // calculate elevation, if 3d not enabled set to 0\n  // cylindar gemoetry height are between -0.5 to 0.5, transform it to between 0, 1\n  float elevation = 0.0;\n\n  if (extruded > 0.5) {\n    elevation = project_scale(instancePositions.z * (positions.y + 0.5) *\n      ELEVATION_SCALE * elevationScale);\n}\n\n  float dotRadius = radius * clamp(coverage, 0.0, 1.0);\n  // // project center of hexagon\n\n  vec4 instancePositions64xy = vec4(\n    instancePositions.x, instancePositions64xyLow.x,\n    instancePositions.y, instancePositions64xyLow.y);\n\n  vec2 projected_coord_xy[2];\n  project_position_fp64(instancePositions64xy, projected_coord_xy);\n\n  vec2 vertex_pos_localspace[4];\n  vec4_fp64(vec4(rotatedPositions.xz * dotRadius, 0.0, 1.0), vertex_pos_localspace);\n\n  vec2 vertex_pos_modelspace[4];\n  vertex_pos_modelspace[0] = sum_fp64(vertex_pos_localspace[0], projected_coord_xy[0]);\n  vertex_pos_modelspace[1] = sum_fp64(vertex_pos_localspace[1], projected_coord_xy[1]);\n  vertex_pos_modelspace[2] = sum_fp64(vertex_pos_localspace[2], vec2(elevation, 0.0));\n  vertex_pos_modelspace[3] = vec2(1.0, 0.0);\n\n  vec4 position_worldspace = vec4(\n    vertex_pos_modelspace[0].x, vertex_pos_modelspace[1].x,\n    vertex_pos_modelspace[2].x, vertex_pos_modelspace[3].x);\n\n  gl_Position = project_to_clipspace_fp64(vertex_pos_modelspace);\n\n  // render display\n  if (renderPickingBuffer < 0.5) {\n\n    // TODO: we should allow the user to specify the color for \"selected element\"\n    // check whether hexagon is currently picked.\n    float selected = isPicked(instancePickingColors, selectedPickingColor);\n\n    // Light calculations\n    // Worldspace is the linear space after Mercator projection\n\n    vec3 normals_worldspace = rotatedNormals;\n\n    float lightWeight = 1.0;\n\n    if (extruded > 0.5) {\n      lightWeight = getLightWeight(\n        position_worldspace.xyz, // the w component is always 1.0\n        normals_worldspace\n      );\n    }\n\n    vec3 lightWeightedColor = lightWeight * instanceColors.rgb;\n\n    // Color: Either opacity-multiplied instance color, or picking color\n    vec4 color = vec4(lightWeightedColor, opacity * instanceColors.a) / 255.0;\n\n    vColor = color;\n\n  } else {\n\n    vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.0);\n    vColor = pickingColor;\n\n  }\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYXllcnMvY29yZS9oZXhhZ29uLWNlbGwtbGF5ZXIvaGV4YWdvbi1jZWxsLWxheWVyLXZlcnRleC02NC5nbHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImhleGFnb24tY2VsbC1sYXllci12ZXJ0ZXgtNjQuZ2xzbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5leHBvcnQgZGVmYXVsdCBgXFxcbiNkZWZpbmUgU0hBREVSX05BTUUgaGV4YWdvbi1jZWxsLWxheWVyLXZlcnRleC1zaGFkZXItNjRcblxuYXR0cmlidXRlIHZlYzMgcG9zaXRpb25zO1xuYXR0cmlidXRlIHZlYzMgbm9ybWFscztcblxuYXR0cmlidXRlIHZlYzMgaW5zdGFuY2VQb3NpdGlvbnM7XG5hdHRyaWJ1dGUgdmVjMiBpbnN0YW5jZVBvc2l0aW9uczY0eHlMb3c7XG5hdHRyaWJ1dGUgdmVjNCBpbnN0YW5jZUNvbG9ycztcbmF0dHJpYnV0ZSB2ZWMzIGluc3RhbmNlUGlja2luZ0NvbG9ycztcblxuLy8gUGlja2luZyB1bmlmb3Jtc1xuLy8gU2V0IHRvIDEuMCBpZiByZW5kZXJpbmcgcGlja2luZyBidWZmZXIsIDAuMCBpZiByZW5kZXJpbmcgZm9yIGRpc3BsYXlcbnVuaWZvcm0gZmxvYXQgcmVuZGVyUGlja2luZ0J1ZmZlcjtcbnVuaWZvcm0gdmVjMyBzZWxlY3RlZFBpY2tpbmdDb2xvcjtcblxuLy8gQ3VzdG9tIHVuaWZvcm1zXG51bmlmb3JtIGZsb2F0IG9wYWNpdHk7XG51bmlmb3JtIGZsb2F0IHJhZGl1cztcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XG51bmlmb3JtIGZsb2F0IGV4dHJ1ZGVkO1xudW5pZm9ybSBmbG9hdCBjb3ZlcmFnZTtcbnVuaWZvcm0gZmxvYXQgZWxldmF0aW9uU2NhbGU7XG5cbi8vIFJlc3VsdFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcblxuLy8gQSBtYWdpYyBudW1iZXIgdG8gc2NhbGUgZWxldmF0aW9uIHNvIHRoYXQgMSB1bml0IGFwcHJveGltYXRlIHRvIDEgbWV0ZXIuXG4jZGVmaW5lIEVMRVZBVElPTl9TQ0FMRSAwLjhcblxuZmxvYXQgaXNQaWNrZWQodmVjMyBwaWNraW5nQ29sb3JzLCB2ZWMzIHNlbGVjdGVkQ29sb3IpIHtcbiByZXR1cm4gZmxvYXQocGlja2luZ0NvbG9ycy54ID09IHNlbGVjdGVkQ29sb3IueFxuICYmIHBpY2tpbmdDb2xvcnMueSA9PSBzZWxlY3RlZENvbG9yLnlcbiAmJiBwaWNraW5nQ29sb3JzLnogPT0gc2VsZWN0ZWRDb2xvci56KTtcbn1cblxudm9pZCBtYWluKHZvaWQpIHtcblxuICAvLyByb3RhdGUgcHJpbWl0aXZlIHBvc2l0aW9uIGFuZCBub3JtYWxcbiAgbWF0MiByb3RhdGlvbk1hdHJpeCA9IG1hdDIoY29zKGFuZ2xlKSwgLXNpbihhbmdsZSksIHNpbihhbmdsZSksIGNvcyhhbmdsZSkpO1xuXG4gIHZlYzIgclBvcyA9IHJvdGF0aW9uTWF0cml4ICogcG9zaXRpb25zLnh6O1xuICB2ZWMyIHJOb3JtID0gcm90YXRpb25NYXRyaXggKiBub3JtYWxzLnh6O1xuXG4gIHZlYzMgcm90YXRlZFBvc2l0aW9ucyA9IHZlYzMoclBvcy54LCBwb3NpdGlvbnMueSwgclBvcy55KTtcbiAgdmVjMyByb3RhdGVkTm9ybWFscyA9IHZlYzMock5vcm0ueCwgbm9ybWFscy55LCByTm9ybS55KTtcblxuICAvLyBjYWxjdWxhdGUgZWxldmF0aW9uLCBpZiAzZCBub3QgZW5hYmxlZCBzZXQgdG8gMFxuICAvLyBjeWxpbmRhciBnZW1vZXRyeSBoZWlnaHQgYXJlIGJldHdlZW4gLTAuNSB0byAwLjUsIHRyYW5zZm9ybSBpdCB0byBiZXR3ZWVuIDAsIDFcbiAgZmxvYXQgZWxldmF0aW9uID0gMC4wO1xuXG4gIGlmIChleHRydWRlZCA+IDAuNSkge1xuICAgIGVsZXZhdGlvbiA9IHByb2plY3Rfc2NhbGUoaW5zdGFuY2VQb3NpdGlvbnMueiAqIChwb3NpdGlvbnMueSArIDAuNSkgKlxuICAgICAgRUxFVkFUSU9OX1NDQUxFICogZWxldmF0aW9uU2NhbGUpO1xufVxuXG4gIGZsb2F0IGRvdFJhZGl1cyA9IHJhZGl1cyAqIGNsYW1wKGNvdmVyYWdlLCAwLjAsIDEuMCk7XG4gIC8vIC8vIHByb2plY3QgY2VudGVyIG9mIGhleGFnb25cblxuICB2ZWM0IGluc3RhbmNlUG9zaXRpb25zNjR4eSA9IHZlYzQoXG4gICAgaW5zdGFuY2VQb3NpdGlvbnMueCwgaW5zdGFuY2VQb3NpdGlvbnM2NHh5TG93LngsXG4gICAgaW5zdGFuY2VQb3NpdGlvbnMueSwgaW5zdGFuY2VQb3NpdGlvbnM2NHh5TG93LnkpO1xuXG4gIHZlYzIgcHJvamVjdGVkX2Nvb3JkX3h5WzJdO1xuICBwcm9qZWN0X3Bvc2l0aW9uX2ZwNjQoaW5zdGFuY2VQb3NpdGlvbnM2NHh5LCBwcm9qZWN0ZWRfY29vcmRfeHkpO1xuXG4gIHZlYzIgdmVydGV4X3Bvc19sb2NhbHNwYWNlWzRdO1xuICB2ZWM0X2ZwNjQodmVjNChyb3RhdGVkUG9zaXRpb25zLnh6ICogZG90UmFkaXVzLCAwLjAsIDEuMCksIHZlcnRleF9wb3NfbG9jYWxzcGFjZSk7XG5cbiAgdmVjMiB2ZXJ0ZXhfcG9zX21vZGVsc3BhY2VbNF07XG4gIHZlcnRleF9wb3NfbW9kZWxzcGFjZVswXSA9IHN1bV9mcDY0KHZlcnRleF9wb3NfbG9jYWxzcGFjZVswXSwgcHJvamVjdGVkX2Nvb3JkX3h5WzBdKTtcbiAgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzFdID0gc3VtX2ZwNjQodmVydGV4X3Bvc19sb2NhbHNwYWNlWzFdLCBwcm9qZWN0ZWRfY29vcmRfeHlbMV0pO1xuICB2ZXJ0ZXhfcG9zX21vZGVsc3BhY2VbMl0gPSBzdW1fZnA2NCh2ZXJ0ZXhfcG9zX2xvY2Fsc3BhY2VbMl0sIHZlYzIoZWxldmF0aW9uLCAwLjApKTtcbiAgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzNdID0gdmVjMigxLjAsIDAuMCk7XG5cbiAgdmVjNCBwb3NpdGlvbl93b3JsZHNwYWNlID0gdmVjNChcbiAgICB2ZXJ0ZXhfcG9zX21vZGVsc3BhY2VbMF0ueCwgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzFdLngsXG4gICAgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzJdLngsIHZlcnRleF9wb3NfbW9kZWxzcGFjZVszXS54KTtcblxuICBnbF9Qb3NpdGlvbiA9IHByb2plY3RfdG9fY2xpcHNwYWNlX2ZwNjQodmVydGV4X3Bvc19tb2RlbHNwYWNlKTtcblxuICAvLyByZW5kZXIgZGlzcGxheVxuICBpZiAocmVuZGVyUGlja2luZ0J1ZmZlciA8IDAuNSkge1xuXG4gICAgLy8gVE9ETzogd2Ugc2hvdWxkIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgdGhlIGNvbG9yIGZvciBcInNlbGVjdGVkIGVsZW1lbnRcIlxuICAgIC8vIGNoZWNrIHdoZXRoZXIgaGV4YWdvbiBpcyBjdXJyZW50bHkgcGlja2VkLlxuICAgIGZsb2F0IHNlbGVjdGVkID0gaXNQaWNrZWQoaW5zdGFuY2VQaWNraW5nQ29sb3JzLCBzZWxlY3RlZFBpY2tpbmdDb2xvcik7XG5cbiAgICAvLyBMaWdodCBjYWxjdWxhdGlvbnNcbiAgICAvLyBXb3JsZHNwYWNlIGlzIHRoZSBsaW5lYXIgc3BhY2UgYWZ0ZXIgTWVyY2F0b3IgcHJvamVjdGlvblxuXG4gICAgdmVjMyBub3JtYWxzX3dvcmxkc3BhY2UgPSByb3RhdGVkTm9ybWFscztcblxuICAgIGZsb2F0IGxpZ2h0V2VpZ2h0ID0gMS4wO1xuXG4gICAgaWYgKGV4dHJ1ZGVkID4gMC41KSB7XG4gICAgICBsaWdodFdlaWdodCA9IGdldExpZ2h0V2VpZ2h0KFxuICAgICAgICBwb3NpdGlvbl93b3JsZHNwYWNlLnh5eiwgLy8gdGhlIHcgY29tcG9uZW50IGlzIGFsd2F5cyAxLjBcbiAgICAgICAgbm9ybWFsc193b3JsZHNwYWNlXG4gICAgICApO1xuICAgIH1cblxuICAgIHZlYzMgbGlnaHRXZWlnaHRlZENvbG9yID0gbGlnaHRXZWlnaHQgKiBpbnN0YW5jZUNvbG9ycy5yZ2I7XG5cbiAgICAvLyBDb2xvcjogRWl0aGVyIG9wYWNpdHktbXVsdGlwbGllZCBpbnN0YW5jZSBjb2xvciwgb3IgcGlja2luZyBjb2xvclxuICAgIHZlYzQgY29sb3IgPSB2ZWM0KGxpZ2h0V2VpZ2h0ZWRDb2xvciwgb3BhY2l0eSAqIGluc3RhbmNlQ29sb3JzLmEpIC8gMjU1LjA7XG5cbiAgICB2Q29sb3IgPSBjb2xvcjtcblxuICB9IGVsc2Uge1xuXG4gICAgdmVjNCBwaWNraW5nQ29sb3IgPSB2ZWM0KGluc3RhbmNlUGlja2luZ0NvbG9ycyAvIDI1NS4wLCAxLjApO1xuICAgIHZDb2xvciA9IHBpY2tpbmdDb2xvcjtcblxuICB9XG59XG5gO1xuIl19