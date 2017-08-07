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

export default "\nconst vec2 WORLD_SCALE_FP64 = vec2(81.4873275756836, 0.0000032873668232014097);\n\nuniform vec2 projectionScaleFP64;\nuniform vec2 projectionFP64[16];\n\n// longitude: lnglat_fp64.xy; latitude: lnglat_fp64.zw\nvoid mercatorProject_fp64(vec4 lnglat_fp64, out vec2 out_val[2]) {\n\n#if defined(NVIDIA_FP64_WORKAROUND)\n  out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64 * ONE);\n#else\n  out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64);\n#endif\n  out_val[1] = sub_fp64(PI_FP64,\n    log_fp64(tan_fp64(sum_fp64(PI_4_FP64, radians_fp64(lnglat_fp64.zw) / 2.0))));\n  return;\n}\n\nvoid project_position_fp64(vec4 position_fp64, out vec2 out_val[2]) {\n\n  vec2 pos_fp64[2];\n  mercatorProject_fp64(position_fp64, pos_fp64);\n  vec2 x_fp64 = mul_fp64(pos_fp64[0], projectionScaleFP64);\n  vec2 y_fp64 = mul_fp64(pos_fp64[1], projectionScaleFP64);\n  out_val[0] = mul_fp64(x_fp64, WORLD_SCALE_FP64);\n  out_val[1] = mul_fp64(y_fp64, WORLD_SCALE_FP64);\n\n  return;\n}\n\nvec4 project_to_clipspace_fp64(vec2 vertex_pos_modelspace[4]) {\n  vec2 vertex_pos_clipspace[4];\n  mat4_vec4_mul_fp64(projectionFP64, vertex_pos_modelspace, vertex_pos_clipspace);\n  return vec4(\n    vertex_pos_clipspace[0].x,\n    vertex_pos_clipspace[1].x,\n    vertex_pos_clipspace[2].x,\n    vertex_pos_clipspace[3].x\n    );\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvcHJvamVjdDY0L3Byb2plY3Q2NC5nbHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6InByb2plY3Q2NC5nbHNsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmV4cG9ydCBkZWZhdWx0IGBcXFxuXG5jb25zdCB2ZWMyIFdPUkxEX1NDQUxFX0ZQNjQgPSB2ZWMyKDgxLjQ4NzMyNzU3NTY4MzYsIDAuMDAwMDAzMjg3MzY2ODIzMjAxNDA5Nyk7XG5cbnVuaWZvcm0gdmVjMiBwcm9qZWN0aW9uU2NhbGVGUDY0O1xudW5pZm9ybSB2ZWMyIHByb2plY3Rpb25GUDY0WzE2XTtcblxuLy8gbG9uZ2l0dWRlOiBsbmdsYXRfZnA2NC54eTsgbGF0aXR1ZGU6IGxuZ2xhdF9mcDY0Lnp3XG52b2lkIG1lcmNhdG9yUHJvamVjdF9mcDY0KHZlYzQgbG5nbGF0X2ZwNjQsIG91dCB2ZWMyIG91dF92YWxbMl0pIHtcblxuI2lmIGRlZmluZWQoTlZJRElBX0ZQNjRfV09SS0FST1VORClcbiAgb3V0X3ZhbFswXSA9IHN1bV9mcDY0KHJhZGlhbnNfZnA2NChsbmdsYXRfZnA2NC54eSksIFBJX0ZQNjQgKiBPTkUpO1xuI2Vsc2VcbiAgb3V0X3ZhbFswXSA9IHN1bV9mcDY0KHJhZGlhbnNfZnA2NChsbmdsYXRfZnA2NC54eSksIFBJX0ZQNjQpO1xuI2VuZGlmXG4gIG91dF92YWxbMV0gPSBzdWJfZnA2NChQSV9GUDY0LFxuICAgIGxvZ19mcDY0KHRhbl9mcDY0KHN1bV9mcDY0KFBJXzRfRlA2NCwgcmFkaWFuc19mcDY0KGxuZ2xhdF9mcDY0Lnp3KSAvIDIuMCkpKSk7XG4gIHJldHVybjtcbn1cblxudm9pZCBwcm9qZWN0X3Bvc2l0aW9uX2ZwNjQodmVjNCBwb3NpdGlvbl9mcDY0LCBvdXQgdmVjMiBvdXRfdmFsWzJdKSB7XG5cbiAgdmVjMiBwb3NfZnA2NFsyXTtcbiAgbWVyY2F0b3JQcm9qZWN0X2ZwNjQocG9zaXRpb25fZnA2NCwgcG9zX2ZwNjQpO1xuICB2ZWMyIHhfZnA2NCA9IG11bF9mcDY0KHBvc19mcDY0WzBdLCBwcm9qZWN0aW9uU2NhbGVGUDY0KTtcbiAgdmVjMiB5X2ZwNjQgPSBtdWxfZnA2NChwb3NfZnA2NFsxXSwgcHJvamVjdGlvblNjYWxlRlA2NCk7XG4gIG91dF92YWxbMF0gPSBtdWxfZnA2NCh4X2ZwNjQsIFdPUkxEX1NDQUxFX0ZQNjQpO1xuICBvdXRfdmFsWzFdID0gbXVsX2ZwNjQoeV9mcDY0LCBXT1JMRF9TQ0FMRV9GUDY0KTtcblxuICByZXR1cm47XG59XG5cbnZlYzQgcHJvamVjdF90b19jbGlwc3BhY2VfZnA2NCh2ZWMyIHZlcnRleF9wb3NfbW9kZWxzcGFjZVs0XSkge1xuICB2ZWMyIHZlcnRleF9wb3NfY2xpcHNwYWNlWzRdO1xuICBtYXQ0X3ZlYzRfbXVsX2ZwNjQocHJvamVjdGlvbkZQNjQsIHZlcnRleF9wb3NfbW9kZWxzcGFjZSwgdmVydGV4X3Bvc19jbGlwc3BhY2UpO1xuICByZXR1cm4gdmVjNChcbiAgICB2ZXJ0ZXhfcG9zX2NsaXBzcGFjZVswXS54LFxuICAgIHZlcnRleF9wb3NfY2xpcHNwYWNlWzFdLngsXG4gICAgdmVydGV4X3Bvc19jbGlwc3BhY2VbMl0ueCxcbiAgICB2ZXJ0ZXhfcG9zX2NsaXBzcGFjZVszXS54XG4gICAgKTtcbn1cbmA7XG4iXX0=