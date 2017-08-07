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

export default "#define SHADER_NAME reflection-effect-fs\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform sampler2D reflectionTexture;\nuniform int reflectionTextureWidth;\nuniform int reflectionTextureHeight;\n\nuniform float reflectivity;\nuniform float blur;\n\n\nvarying vec2 uv;\n\n#define KERNEL_SIZE 7\n\n/*\n * Samples from tex with a gaussian-shaped patch, centered at uv and\n * with standard deviation sigma.  The size of the texture in\n * pixels must be specified by dim\n */\nvec4 sample_gaussian(sampler2D tex, vec2 dim, vec2 uv, float sigma) {\n  if (sigma == 0.0) {\n    return texture2D(tex, uv);\n  }\n\n  vec2 delta = 1.0 / dim;\n  vec2 top_left = uv - delta * float(KERNEL_SIZE+1) / 2.0;\n\n  vec4 color = vec4(0);\n  float sum = 0.0;\n  for (int i = 0; i <  KERNEL_SIZE; ++i) {\n    for (int j = 0; j < KERNEL_SIZE; ++j) {\n      vec2 uv2 = top_left + vec2(i, j) * delta;\n      float d = length((uv2 - uv) * dim);\n      float f = exp(-(d*d) / (2.0*sigma * sigma));\n      color += f * texture2D(tex, uv2);\n      sum += f;\n    }\n  }\n  return color / sum;\n}\n\nvoid main(void) {\n  //map blur in [0, 1] to sigma in [0, inf]\n  //alpha will determine the \"steepness\" of our curve.\n  //this was picked just to make the scale feel \"natural\"\n  //if our image is 1000 pixels wide, a blur of 0.5 should correspond\n  //to a sigma of 1 pixels\n  float alpha = 1000.0;\n  float sigma = blur / (alpha * (1.0 - blur));\n  //let this be our standard deviation in terms of screen-widths.\n  //rewrite this in terms of pixels.\n  sigma *= float(reflectionTextureWidth);\n\n\n  gl_FragColor = sample_gaussian(reflectionTexture, vec2(reflectionTextureWidth,\n    reflectionTextureHeight), vec2(uv.x, 1. - uv.y), sigma);\n  //because our canvas expects alphas to be pre-multiplied, we multiply by whole\n  //color vector by reflectivity, not just the alpha channel\n  gl_FragColor *= reflectivity;\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwvZWZmZWN0cy9yZWZsZWN0aW9uLWVmZmVjdC9yZWZsZWN0aW9uLWVmZmVjdC1mcmFnbWVudC5nbHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6InJlZmxlY3Rpb24tZWZmZWN0LWZyYWdtZW50Lmdsc2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuZXhwb3J0IGRlZmF1bHQgYFxcXG4jZGVmaW5lIFNIQURFUl9OQU1FIHJlZmxlY3Rpb24tZWZmZWN0LWZzXG5cbiNpZmRlZiBHTF9FU1xucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuI2VuZGlmXG5cbnVuaWZvcm0gc2FtcGxlcjJEIHJlZmxlY3Rpb25UZXh0dXJlO1xudW5pZm9ybSBpbnQgcmVmbGVjdGlvblRleHR1cmVXaWR0aDtcbnVuaWZvcm0gaW50IHJlZmxlY3Rpb25UZXh0dXJlSGVpZ2h0O1xuXG51bmlmb3JtIGZsb2F0IHJlZmxlY3Rpdml0eTtcbnVuaWZvcm0gZmxvYXQgYmx1cjtcblxuXG52YXJ5aW5nIHZlYzIgdXY7XG5cbiNkZWZpbmUgS0VSTkVMX1NJWkUgN1xuXG4vKlxuICogU2FtcGxlcyBmcm9tIHRleCB3aXRoIGEgZ2F1c3NpYW4tc2hhcGVkIHBhdGNoLCBjZW50ZXJlZCBhdCB1diBhbmRcbiAqIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNpZ21hLiAgVGhlIHNpemUgb2YgdGhlIHRleHR1cmUgaW5cbiAqIHBpeGVscyBtdXN0IGJlIHNwZWNpZmllZCBieSBkaW1cbiAqL1xudmVjNCBzYW1wbGVfZ2F1c3NpYW4oc2FtcGxlcjJEIHRleCwgdmVjMiBkaW0sIHZlYzIgdXYsIGZsb2F0IHNpZ21hKSB7XG4gIGlmIChzaWdtYSA9PSAwLjApIHtcbiAgICByZXR1cm4gdGV4dHVyZTJEKHRleCwgdXYpO1xuICB9XG5cbiAgdmVjMiBkZWx0YSA9IDEuMCAvIGRpbTtcbiAgdmVjMiB0b3BfbGVmdCA9IHV2IC0gZGVsdGEgKiBmbG9hdChLRVJORUxfU0laRSsxKSAvIDIuMDtcblxuICB2ZWM0IGNvbG9yID0gdmVjNCgwKTtcbiAgZmxvYXQgc3VtID0gMC4wO1xuICBmb3IgKGludCBpID0gMDsgaSA8ICBLRVJORUxfU0laRTsgKytpKSB7XG4gICAgZm9yIChpbnQgaiA9IDA7IGogPCBLRVJORUxfU0laRTsgKytqKSB7XG4gICAgICB2ZWMyIHV2MiA9IHRvcF9sZWZ0ICsgdmVjMihpLCBqKSAqIGRlbHRhO1xuICAgICAgZmxvYXQgZCA9IGxlbmd0aCgodXYyIC0gdXYpICogZGltKTtcbiAgICAgIGZsb2F0IGYgPSBleHAoLShkKmQpIC8gKDIuMCpzaWdtYSAqIHNpZ21hKSk7XG4gICAgICBjb2xvciArPSBmICogdGV4dHVyZTJEKHRleCwgdXYyKTtcbiAgICAgIHN1bSArPSBmO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sb3IgLyBzdW07XG59XG5cbnZvaWQgbWFpbih2b2lkKSB7XG4gIC8vbWFwIGJsdXIgaW4gWzAsIDFdIHRvIHNpZ21hIGluIFswLCBpbmZdXG4gIC8vYWxwaGEgd2lsbCBkZXRlcm1pbmUgdGhlIFwic3RlZXBuZXNzXCIgb2Ygb3VyIGN1cnZlLlxuICAvL3RoaXMgd2FzIHBpY2tlZCBqdXN0IHRvIG1ha2UgdGhlIHNjYWxlIGZlZWwgXCJuYXR1cmFsXCJcbiAgLy9pZiBvdXIgaW1hZ2UgaXMgMTAwMCBwaXhlbHMgd2lkZSwgYSBibHVyIG9mIDAuNSBzaG91bGQgY29ycmVzcG9uZFxuICAvL3RvIGEgc2lnbWEgb2YgMSBwaXhlbHNcbiAgZmxvYXQgYWxwaGEgPSAxMDAwLjA7XG4gIGZsb2F0IHNpZ21hID0gYmx1ciAvIChhbHBoYSAqICgxLjAgLSBibHVyKSk7XG4gIC8vbGV0IHRoaXMgYmUgb3VyIHN0YW5kYXJkIGRldmlhdGlvbiBpbiB0ZXJtcyBvZiBzY3JlZW4td2lkdGhzLlxuICAvL3Jld3JpdGUgdGhpcyBpbiB0ZXJtcyBvZiBwaXhlbHMuXG4gIHNpZ21hICo9IGZsb2F0KHJlZmxlY3Rpb25UZXh0dXJlV2lkdGgpO1xuXG5cbiAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlX2dhdXNzaWFuKHJlZmxlY3Rpb25UZXh0dXJlLCB2ZWMyKHJlZmxlY3Rpb25UZXh0dXJlV2lkdGgsXG4gICAgcmVmbGVjdGlvblRleHR1cmVIZWlnaHQpLCB2ZWMyKHV2LngsIDEuIC0gdXYueSksIHNpZ21hKTtcbiAgLy9iZWNhdXNlIG91ciBjYW52YXMgZXhwZWN0cyBhbHBoYXMgdG8gYmUgcHJlLW11bHRpcGxpZWQsIHdlIG11bHRpcGx5IGJ5IHdob2xlXG4gIC8vY29sb3IgdmVjdG9yIGJ5IHJlZmxlY3Rpdml0eSwgbm90IGp1c3QgdGhlIGFscGhhIGNoYW5uZWxcbiAgZ2xfRnJhZ0NvbG9yICo9IHJlZmxlY3Rpdml0eTtcbn1cbmA7XG4iXX0=