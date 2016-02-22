/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function Attribute (name,offset,stride) {
  this.name = name;
  this.offset = offset;
  this.stride = stride;
  this.size = -1;
  this.location = -1;

}




/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 
 "use strict"
 
function Camera() {
    Leaf.call(this);
    
    this.ID = 'camera';

    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    mat4.identity(this.viewMatrix);
    this.fovy = 45.0*Math.PI/180.0;
    this.zoom = 1.0;

      // NodeGL
    this.nodeGL = new CameraGL(this);
}

Camera.prototype = new Leaf;

Camera.prototype.setFovy = function (angle_in_degrees) {
  this.fovy= angle_in_degrees * Math.PI/180.0;
}




/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function CameraGL(node) {
    this.sgnode = node;
    this.glType = -1;
    this._isDirty = true;
    
    // Matrix for rotation(s) and translation(s)
    this.workmatrix= mat4.create();
    mat4.identity(this.workmatrix);
}

CameraGL.prototype.isDirty = function() {
    return _isDirty;
}

CameraGL.prototype.setViewport = function (width, height) {
  mat4.perspective(this.sgnode.projMatrix,this.sgnode.fovy * this.sgnode.zoom,width / height,0.1,1000.0);
}

CameraGL.prototype.init = function(context) {
    // Do nothing
    this.isDirty = false;
}

CameraGL.prototype.render = function(context) {
    var gl = context;
    console.log('RENDER CAM++ ' ,gl.viewportWidth,gl.viewportHeight);
    console.log(context);
    this.setViewport(gl.viewportWidth,gl.viewportHeight);
    this.sgnode.getRenderer().setUniform("uVMatrix", this.sgnode.viewMatrix);
    this.sgnode.getRenderer().setUniform("uPMatrix", this.sgnode.projMatrix);
}





/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function Composite(node) {
    this.children = {};
    this._isDirty = true;
    this.parent   = null;
    this.renderer = null;
    
    // 
    this.nodeGL   = null;
    
    // Matrix for rotation(s) and translation(s)
    this.matrix=mat4.create();
    mat4.identity(this.matrix);
}

Composite.prototype.add = function(an_object) {
    this.children[an_object.ID+'_' + size(this.children)] = an_object;
    an_object.parent = this;
    
    function size(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
}

Composite.prototype.getNodeGL = function() {
    return this.nodeGL;
}

Composite.prototype.getRenderer = function() {
    console.log(this);
    if (this.renderer != null) {
        return this.renderer;
    }
    else if (this.parent instanceof Renderer){
        this.renderer = this.parent;
        return this.renderer;
    }
    return this.parent.getRenderer();
}

Composite.prototype.isDirty = function() {
    return _isDirty;
}

/**
 * Init the OpenGL config of this object in the scene graph
 * and traverse its children.
 * Function called by the renderer
 *
 * @param{number} OpenGL context
 **/
Composite.prototype.init = function(context) {
    // Uniforms
    console.log('INIT ' + this.ID);
    this.getNodeGL().init(context);
    for (var i in this.children) {
        traverse(context,this.children[i]);
    }
    this.isDirty = false;
    
    function traverse(context,a_node) {
        console.log('INIT ' + a_node.ID);
        a_node.init(context);
        for (var i in a_node.children) {
            traverse(context,a_node.children[i]);
        }
    }
}

/**
 * Render this object and traverse its children
 * Function called by the renderer
 *
 * @param{number} OpenGL context
 **/
Composite.prototype.render = function(context) {

    console.log('RENDER_Composite ' + this.ID );
    console.log(this.parent);
    // Update matrix
    if (!(this.parent instanceof Renderer) ) {
        console.log('multiply');
        mat4.multiply(this.getNodeGL().workmatrix,this.parent.getNodeGL().workmatrix,this.matrix);
    }
    // Render
    this.getNodeGL().render(context);
    // Propagate to children
    for (var i in this.children) {
        traverse(context,this.children[i]);
    }
    
    function traverse(context,a_node) {
        console.log('RENDER_child ' + a_node.ID);
        a_node.render(context);
        for (var i in a_node.children) {
            traverse(context,a_node.children[i]);
        }
    }

}


/***
Composite.prototype._updateAttributes = function(context) {
    var gl = context;

  if (this.shaderProgram.attributes.length != this.geometry.attributes.length) {
    console.log(this.shaderProgram.attributes);
    console.log(this.shaderProgram.attributes.length + ' != ' + this.geometry.attributesLength() );
    console.log("MOWGLI: Attributes are not correctly defined");
  }

    for (var i=0; i < this.geometry.VBO.length;i++) {
        var vbo = this.geometry.VBO[i];
        for (var j=0; j < vbo.attributes.length; j++) {
            vbo.attributes[j].location = this.shaderProgram.getAttribLocation(vbo.attributes[j].name);
            vbo.attributes[j].size = this.shaderProgram.attributes[vbo.attributes[j].name].size;
            console.log('location [' + vbo.attributes[j].name + ']= '+ vbo.attributes[j].location + ' '+vbo.attributes[j].size);
        }
    }
}
*****/

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/**
 * Geometry contains geometrical data like coordinates, normals, texCoords, colors,etc.
 *
 * @class Geometry
 * @constructor
 **/
function Geometry (options) {
  console.log(options);
  this.type    = options.type || 'none';
  this.content = options.content;
  this.data    = options.data;
  this.attributes = options.attributes; // || [];

  this.indices = options.indices;
  if (this.type === 'indexed') {
    this._isIndexed = true;
  }
  else {
    this._isIndexed = false;
  }

    console.log('end create GEOM');
    console.log(this.attributes);
}

Geometry.prototype.getBuffer = function(name) {
  var stop = false;
  var i=0;
  while (!stop && i < this.VBO.length) {
    if (this.VBO[i].type === name) {
      return this.VBO[i];
    }
    i++;
  }
  return null;
}

Geometry.prototype.isIndexed = function() {
  return this._isIndexed;
}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function Leaf(node) {
    this._isDirty = true;
    this.parent = null;
    this.renderer = null;
    
    // 
    this.nodeGL = null;
    
    // Matrix for rotation(s) and translation(s)
    this.matrix=mat4.create();
    mat4.identity(this.matrix);
}

Leaf.prototype.isDirty = function() {
    return _isDirty;
}

Leaf.prototype.getNodeGL = function() {
    return this.nodeGL;
}

Leaf.prototype.getRenderer = function() {
    console.log(this);
    if (this.renderer != null) {
        return this.renderer;
    }
    else if (this.parent instanceof Renderer) {
        this.renderer = this.parent;
        return this.renderer;
    }
    return this.parent.getRenderer();
}

/**
 * Init the OpenGL config of this object in the scene graph
 * and traverse its children.
 * Function called by the renderer
 *
 * @param{number} OpenGL context
 **/
Leaf.prototype.init = function(context) {
    console.log('INIT ' + this.ID);
    this.getNodeGL().init(context);
}

/**
 * Render this object and traverse its children
 * Function called by the renderer
 *
 * @param{number} OpenGL context
 **/
Leaf.prototype.render = function(context) {
    console.log('RENDER_Leaf ' + this.ID);
    console.log(this.parent.getNodeGL().workmatrix);
    // Update matrix
    mat4.multiply(this.getNodeGL().workmatrix,this.parent.getNodeGL().workmatrix,this.matrix);
    // OpenGL rendering
    this.getNodeGL().render(context);
}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


function Light() {
    Leaf.call(this);
    this.ID = 'light';

      // NodeGL
    this.nodeGL = new NodeGL(this);
}

Light.prototype = new Leaf;



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function NodeGL(node) {
    this.sgnode = node;
    this.glType = -1;
    this._isDirty = true;
    
    // Matrix for rotation(s) and translation(s)
    this.workmatrix= mat4.create();
    mat4.identity(this.workmatrix);
}

NodeGL.prototype.isDirty = function() {
    return _isDirty;
}

NodeGL.prototype.init = function(context) {
    // Do nothing
    this.isDirty = false;
}

NodeGL.prototype.render = function(context) {
    // Do nothing
}





/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 
var Program = function(context,name) {
  this.ctx = context;
  this.name = name;
  this.vertex_shader   = null;
  this.fragment_shader = null;
  this.shaderProgram = 0;
  this.attributes =[];
  this.uniforms = [];
  this.attribLocation = {};
  this.uniformLocation = {};
}

Program.prototype.getID=function() {
  return this.shaderProgram;
}

Program.prototype.load=function(type,name) {
  // TODO
  if (type =='vertex')
    // this.vertex_shader = ShaderFactory.get(type,name);
    console.log('vertex');
  else if (type =='fragment')
    // this.fragment_shader = ShaderFactory.get(type,name);
    console.log('fragment');
  else
    alert('Unknown shader type');
}

Program.prototype.loadHTTP=function(type,name) {
  // From http://www.html5rocks.com/en/tutorials/file/xhr2/
  // XMLHttpRequest()

  var url = 'shaders/'+name+'.'+type;
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = 'text';
  req.onreadystatechange = function() {
    if (req.readyState==4 && req.status==200) {
      this.fragment_shader = this._compile(gl.FRAGMENT_SHADER,this.response);
    }
  }
  req.send();
}

/* From Learning WEBGL */
Program.prototype.loadDOM=function(type,name) {
  var gl = this.ctx;

  var shaderScript = document.getElementById(name);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }


  if (shaderScript.type == "x-shader/x-fragment") {
    this.fragment_shader = this._compile(gl.FRAGMENT_SHADER,str);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    this.vertex_shader = this._compile(gl.VERTEX_SHADER,str);
  } else {
    return null;
  }

  // Extract attribute from shader text and create objects
  this._createAttributesAndUniforms(str);

}


Program.prototype.link=function() {
  var gl = this.ctx;
  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, this.vertex_shader);
  gl.attachShader(this.shaderProgram, this.fragment_shader);
  gl.linkProgram(this.shaderProgram);

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
}

Program.prototype.use=function() {
  var gl = this.ctx;
  gl.useProgram(this.shaderProgram);
}


Program.prototype.getAttribLocation = function(attrib_name) {
  var gl = this.ctx;
  gl.useProgram(this.getID());
  return gl.getAttribLocation(this.getID(),attrib_name);
}


Program.prototype.setUniformLocation=function(name) {
  var gl = this.ctx;
  gl.useProgram(this.getID());
  this.uniformLocation[name]=gl.getUniformLocation(this.getID(),name);
}

Program.prototype.getUniformLocation=function(name) {
  var gl = this.ctx;
  return this.uniformLocation[name];
}

Program.prototype.updateUniforms = function () {
    var gl = this.ctx;
    // Update all the uniforms. This function is called by the renderer.
    for (var i in this.uniforms) {
        var uniform = this.uniforms[i];
        switch (uniform.type) {
        case 'mat4' :
            gl.uniformMatrix4fv(this.getUniformLocation(uniform.name), false, uniform.value);
            break;
        case 'vec3' :
            gl.uniform3fv(this.getUniformLocation(uniform.name), false, uniform.value);
            break;
        case 'vec4' :
            gl.uniform4fv(this.getUniformLocation(uniform.name), false, uniform.value);
            break;
        }

    }
}
/**
 * Private method for compiling shader
 *
 **/
Program.prototype._compile=function(type,text) {
  var gl = this.ctx;
  var shader = gl.createShader(type);        
  gl.shaderSource(shader, text);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

// Private
Program.prototype._createAttributesAndUniforms=function(text) {
  var rows = text.split('\n');
  var re = /[\s,;]+/;
  var type;
  var qualifier = 'x';

  for (var i in rows) {
    var a_row = rows[i];
    if (a_row.indexOf('attribute') != -1 || a_row.indexOf('uniform') != -1) {
      var words = a_row.trim().split(re); //  match(/[\S,;]+/g);
      var itemSize = 0;
      console.log(words);
      for (var j=0; j < words.length; j++) {
        switch (words[j]) {
        case '//':
          // Commented line
          j = words.length; 
          break;
        case 'attribute':
          qualifier = 'a'; 
          break;
        case 'uniform':
          qualifier = 'u'; 
          break;
        case 'bool':
          itemSize = 1;
          type = words[j]; 
          break;
        case 'int' :
          itemSize = 1;
          type = words[j]; 
          break;
        case 'float':
          itemSize = 1;
          type = words[j]; 
          break;
        case 'vec2':
          itemSize = 2;
          type = words[j]; 
          break;
        case 'vec3':
          itemSize = 3;
          type = words[j]; 
          break;
        case 'vec4':
          itemSize = 4;
          type = words[j]; 
          break;
        case 'mat4':
          itemSize = 16;
          type = words[j]; 
          break;
        default:
          if (qualifier == 'a' && words[j] != '') {
            console.log('attribute '+ words[j] + ' type '+ type);
            this.attributes[words[j]] = {'name':words[j],'type':type,'size':itemSize}; 
          }
          else if (qualifier == 'u' && words[j] != '') {
            console.log('uniform '+ words[j] + ' type '+ type);
            this.uniforms[words[j]] = {'name':words[j],'type':type,'size':itemSize};
          } 
          break;
        }
      }
    }
  }
}




/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Core class for rendering in the canvas
 * Singleton ??
 *
 * @class Renderer
 * @constructor
 */
function Renderer(canvas_id) {
  this.scene = null;

  // Get A WebGL context
  function createWebGLContext(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var ii in names) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch(e) {}
      if (context) {
        break;
      }
    }
    return context;
  }

  var canvas = document.getElementById(canvas_id);
  this.context = createWebGLContext(canvas);

  if (!this.context) {
    return;
  }

  // Properties
  this.context.viewportWidth  = canvas.width;
  this.context.viewportHeight = canvas.height;
  this.shaders=[];
  this.shaderProgram=null; //Active program ID

  // Init GL
  this._initGL();
}

Renderer.prototype.getContext = function () {
  return this.context;
}

Renderer.prototype.addScene = function (a_scene) {
  this.scene = a_scene;
  a_scene.parent = this;
}

Renderer.prototype.addShader = function (a_shaderprogram) {
    this.shaders.push(a_shaderprogram);
}

Renderer.prototype.addSensor = function (a_sensor) {
  this.sensor = a_sensor;
  this.sensor.setRenderer(this);
}

Renderer.prototype.setUniform = function (name,value) {
    for (var i in this.shaders) {
        var shader = this.shaders[i];
        shader.uniforms[name].value = value;
    }
}

Renderer.prototype.drawScene = function () {
    var gl = this.context;
    
    // Clear Screen And Depth Buffer
    gl.viewport(0.0, 0.0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Traverse scene graph
    console.log('*************** RENDER ***************');
    this.scene.render(gl);
}

Renderer.prototype.init = function () {
    var gl = this.context;
    this.scene.init(gl);
  // TODO
}


/*
 * Private
 */

Renderer.FLOAT_IN_BYTES = 4;

Renderer.prototype._initGL = function() {
  // Init GL stuff
  var gl = this.context;
  // TODO
  // Default clearColor
  gl.clearColor(0.1,0.1,0.1,1.0);

  gl.enable(gl.DEPTH_TEST);

  // Check extension...
  gl.getExtension("EXT_frag_depth");
  if (gl.getSupportedExtensions().indexOf("EXT_frag_depth") < 0 ) {
    alert('Extension frag_depth not supported');
  }


  // Default shader program
  this.program = new Program();
}

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
var Scene = function () {
    Composite.call(this);
    
    this.ID = 'scene';
    this.add(new Camera() );
    this.add(new Light()  );
    
    this.nodeGL = new NodeGL();

}

Scene.prototype = Object.create(Composite.prototype);

Scene.prototype.getCamera = function() {
    return this.children['camera_0'];
}

Scene.prototype.toString = function() {
    var str = this.ID+'\n';
    for (var i in this.children) {
        str += '+-'+this.children[i].ID+'\n';
    }
    return str;
}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function Shape() {
    Leaf.call(this);
    
    this.ID = 'shape';
    this.colorMode = 'monochrome';
    this.shaderProgram = null;
    this.geometries = [];
    this.uniforms   = [];

    this.type = 'POINTS';
    this.glType = 0; // gl.POINTS
    this.numItems = 0;
    this.numIndices = 0;
    this.parent = null;
    this.cg = {'x':0,'y':0,'z':0};

    this._isIndexed=false;
    
    this.nodeGL = new ShapeGL(this);
    

}

Shape.prototype = Object.create(Leaf.prototype);

Shape.XYZ    = 1;
Shape.XYZW   = 2;
Shape.NXYZ   = 4;
Shape.RGB    = 8;
Shape.RGBA   = 16;
Shape.ST     = 32;

Shape.itemLength = {
    1  : 3,
    2  : 4,
    4  : 3,
    8  : 3,
    16 : 4,
    32 : 2
}

Shape.prototype.setProgram = function(a_program) {
  console.log(a_program);
  this.nodeGL.shaderProgram = a_program;
}

Shape.prototype.isIndexedGeometry = function() {
  return this._isIndexed;
}

Shape.prototype.addVertexData = function(a_geom) {
    if (a_geom.indices != undefined) {
        this._isIndexed = true;
        this.geometries.push( 
            new Geometry({
                'type'       : 'indexed',
                'content'    : a_geom.content,
                'data'       : new Float32Array(a_geom.data),
                'indices'    : new Uint16Array(a_geom.indices),
                'attributes' : a_geom.attributes
            }) 
        );
        this.numIndices = a_geom.indices.length;
    }
    else {
        this.geometries.push( 
            new Geometry( {
                'type'     : 'vertex',
                'content'    : a_geom.content,
                'data'     : new Float32Array(a_geom.data),
                'attributes' : a_geom.attributes
            }) 
        );    
    }

    console.log(this.geometries);
    // Set the number of items in this shape
    // this.numItems = a_geom.data.length / itemSize;
}

Shape.prototype.addUniformData = function(a_uniform) {
    this.uniforms.push(a_uniform);
}


Shape.prototype.setCentroid = function(cg) {
    this.cg = cg;
}

Shape.prototype.updateUniforms = function (context) {

}




/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

var ShapeFactory = (function () {
 
  // Storage for our various styles types
  var styles = {};
 
  return {
    get: function ( options ) {
      switch (options.style) {
      case "points":
        // Already computed for the given structure?
        // var style = types['atoms'] ????
        // if (style === undefined) then 
        // Basic shape - only for debug
        var style = new PointStyle(options);
        return style.getShape();
        break;
      case "backbone":
        // TODO
        break;
      case "ball_sticks":
        // TODO
        break;
      case "cartoon":
        // TODO
        break;
      case "dots":
        // TODO
        break;
      case "spacefill":
        // TODO
        break;
      case "ribbons":
        // TODO
        break;
      case "sticks":
        // TODO
        break;
      case "strands":
        // TODO
        break;
      case "trace":
        // TODO
        break;
      case "wireframe":
        // TODO
        break;
      default:
        // Do nothing ??
        return null;
      }
    }
  };
})();
 
 

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function ShapeGL(node) {
    NodeGL.call(this,node);

    this.numIndices = 0;
    this.numItems = 0;
    this.VBOs = [];
    this.shaderProgram = null;
}

ShapeGL.prototype.isDirty = function() {
    return _isDirty;
}

ShapeGL.prototype.init = function(context) {

    // Get the corresponding node of the scene graph
    var shape = this.sgnode;
    console.log(shape);
    // Add shader(s) to the renderer for uniform management
    this.sgnode.getRenderer().addShader(this.shaderProgram);
    
    // For each buffer, create corresponding VBO
    for (var i in shape.geometries) {
    console.log(shape.geometries[i]);
        this.VBOs[i] = this._createVBO(context,shape.geometries[i]);
    }
    
    // All is fine (I hope ?)
    this.isDirty = false;
}

ShapeGL.prototype._createVBO = function(context,geom) {
    var gl = context;
    console.log('SHAPE TYPE ' + this.sgnode.type);
    switch (this.sgnode.type) {
    case 'POINTS':
    case 'POINTS_RADIUS': 
        this.glType = gl.POINTS;
        break;
    case 'LINES':
        this.glType = gl.LINES;
        break;
    case 'LINE_STRIP':
        this.glType = gl.LINE_STRIP;
        break;
    case 'LINE_LOOP':
        this.glType = gl.LINE_LOOP;
        break;
    case 'TRIANGLES':
        this.glType = gl.TRIANGLES;
        break;
    case 'TRIANGLE_STRIP':
        this.glType = gl.TRIANGLE_STRIP;
        break;
    }
    // Init VBO
    var vbo = {};
    vbo.attributes = [];
    vbo.type = geom.type;
    
    // Create VBO
    vbo.ID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.ID);
    gl.bufferData(gl.ARRAY_BUFFER, geom.data, gl.STATIC_DRAW);

    // Update attribute(s) associated to this VBO
    console.log('VBO attributes');
    console.log(geom.attributes);
    for (var j=0; j < geom.attributes.length; j++) {
        if ( (geom.content & Shape.XYZ) == Shape.XYZ) {
            var n = 32 // Highest value of Shape type(s)
            var nItems = 0;
            while (n != 0) {
                if ( (geom.content & n) == n) {
                    nItems += Shape.itemLength[n];
                }
                n/=2;
            }
            this.numItems = geom.data.length / nItems;
        }
        vbo.attributes[j] = {};
        vbo.attributes[j].name     = geom.attributes[j].name;
        vbo.attributes[j].location = this.shaderProgram.getAttribLocation(geom.attributes[j].name);
        vbo.attributes[j].size     = this.shaderProgram.attributes[vbo.attributes[j].name].size;
        vbo.attributes[j].stride   = geom.attributes[j].stride;
        vbo.attributes[j].offset   = geom.attributes[j].offset;
        console.log('location [' + vbo.attributes[j].name + ']= '+ vbo.attributes[j].location + ' '+vbo.attributes[j].size);
    }

    if (vbo.type === 'indexed') {
        vbo.IndxID = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.IndxID);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geom.indices, gl.STATIC_DRAW);
        this.numIndices = geom.indices.length;
    }
    console.log('VBO ID: ' + JSON.stringify(vbo) );
    return vbo;

}

ShapeGL.prototype.render = function(context) {
    var gl = context;
    // Update matrix
    mat4.multiply(this.workmatrix,this.sgnode.parent.getNodeGL().workmatrix,this.sgnode.matrix);
    this.sgnode.getRenderer().setUniform("uMMatrix", this.workmatrix);
    
    // Choose shader
    console.log(this.shaderProgram);
    this.shaderProgram.use();

    // TODO Update uniforms
    this.shaderProgram.updateUniforms();
    
    console.log('coordSize '+ this.numItems );

    // For this geometry, activate VBO
    for (var j in this.VBOs) {
        var vbo = this.VBOs[j];
        if (vbo.type === 'indexed') {
            console.log('bind buffer '+ vbo.type + ' ' + vbo.ID+ ' ' + vbo.data);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.IndxID);
        }
        else {
            console.log('bind buffer '+ vbo.type + ' ' + vbo.ID);
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo.ID);
        }
        for (var k in vbo.attributes) {
            var attribute = vbo.attributes[k];
            console.log('enable ' + attribute.name+' '+attribute.location+' '+attribute.size+' '+attribute.stride+' '+attribute.offset);
            gl.enableVertexAttribArray(attribute.location );
            gl.vertexAttribPointer(
                attribute.location,
                attribute.size,
                gl.FLOAT,
                false,
                attribute.stride * Renderer.FLOAT_IN_BYTES,
                attribute.offset * Renderer.FLOAT_IN_BYTES
            );
        }
    }
    // Draw ...
    console.log(this.sgnode.type + ' '+ this.glType +' '+ this.numIndices+' '+ this.numItems);
    if (this.numIndices != 0 ) {
        gl.drawElements(this.glType, this.numIndices, gl.UNSIGNED_SHORT, 0);
    }
    else {
        console.log('drawArrays');
        gl.drawArrays(this.glType, 0, this.numItems);
    }
}



ShapeGL.prototype._updateAttributes = function(context) {
    var gl = context;
/***
  if (this.shaderProgram.attributes.length != this.geometry.attributes.length) {
    console.log(this.shaderProgram.attributes);
    console.log(this.shaderProgram.attributes.length + ' != ' + this.geometry.attributesLength() );
    console.log("MOWGLI: Attributes are not correctly defined");
  }
*****/
    for (var i=0; i < this.geometry.VBO.length;i++) {
        var vbo = this.geometry.VBO[i];
        for (var j=0; j < vbo.attributes.length; j++) {
            vbo.attributes[j].location = this.shaderProgram.getAttribLocation(vbo.attributes[j].name);
            vbo.attributes[j].size = this.shaderProgram.attributes[vbo.attributes[j].name].size;
            console.log('location [' + vbo.attributes[j].name + ']= '+ vbo.attributes[j].location + ' '+vbo.attributes[j].size);
        }
    }
}


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
var ShapeGroup = function () {
    Composite.call(this);
    
    this.ID = 'group';
    
    this.nodeGL = new NodeGL(this);

}

ShapeGroup.prototype = Object.create(Composite.prototype);



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
 
 var Cube = function() {
    Shape.call(this);
    this.ID = 'cube';
 }
 
Cube.prototype = Object.create(Shape.prototype );

/*
 * Set style of this cube:
 * @param{string} 'wireframe','solid','shaded','textured'
 */
Cube.prototype.setStyle = function(type) {
    switch (type) {
    case 'wireframe' :
        this.ID = 'cubeWire';
        // 1- Define geometry
        var _indices = [0,1,2,3,0,4,5,6,7,4,5,1,2,6,7,3]; 
        this.type = 'LINE_STRIP';
        this.addVertexData( 
            {
                'content'   : Shape.XYZ,
                'data'      : Cube.verticesWire, 
                'indices'   :_indices, 
                'attributes': [new Attribute("aVertexPosition",0,0)] 
            }
        );
/**
        this.addUniformData(
            {
                'content': ['RGB'],
                'data'   : [1.0,0.6,0.2],
                'uniform': [new Uniform("uColor")]
            }
        )
**/
        this.numItems = Cube.verticesWire.length / 3;
        // 2- Define graphics style
        //this.setProgram(shaderProgram);

        break;
    case 'solid' :
        this.ID = 'cubeSolid';
        this.type = 'TRIANGLES';
        this.addVertexData(
            {
                'content': Shape.XYZ,
                'data': Cube.vertices,
                'indices': Cube.indices, 
                'attributes': [new Attribute("aVertexPosition",0,0)] 
            }
        );
        this.addVertexData(
            {
                'content': Shape.RGB,
                'data': Cube.colors,
                'attributes': [new Attribute("aVertexColor",0,0)] 
            }
        );

        this.addVertexData( 
            {
                'content'   : Shape.XYZ | Shape.RGBA,
                'data'      : Cube.vertices, 
                'indices'   : Cube.indices, 
                'attributes': [new Attribute("aVertexPosition",0,7), new Attribute("aVertexColor",3,7)] 
            }
        );
        this.numItems = Cube.vertices.length / 7;
        break;
    case 'shaded':
        this.ID = 'cubeShaded'; 
        // TODO
        break;
    case 'textured' :
        this.ID = 'cubeTextured'; 
        // TODO
        break;
    default:
    
    }
}
 
  
Cube.verticesWire = [
     1, 1,-1,
     1,-1,-1,
    -1,-1,-1,
    -1, 1,-1,
     1, 1, 1,
     1,-1, 1,
    -1,-1, 1,
    -1, 1, 1
];

Cube.vertices = [
    // Front face
    -1.0, -1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
     1.0,  1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 1.0, 0.0, 0.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
     1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
     1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,

    // Top face
    -1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
     1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
     1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
     1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
     1.0, -1.0,  1.0, 1.0, 0.5, 0.5, 1.0,
    -1.0, -1.0,  1.0, 1.0, 0.5, 0.5, 1.0,

    // Right face
     1.0, -1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
     1.0,  1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
     1.0,  1.0,  1.0, 1.0, 0.0, 1.0, 1.0,
     1.0, -1.0,  1.0, 1.0, 0.0, 1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
    -1.0, -1.0,  1.0, 0.0, 0.0, 1.0, 1.0,
    -1.0,  1.0,  1.0, 0.0, 0.0, 1.0, 1.0,
    -1.0,  1.0, -1.0, 0.0, 0.0, 1.0, 1.0
];

Cube.indices = [
     0, 1, 2,      0, 2, 3,    // Front face
     4, 5, 6,      4, 6, 7,    // Back face
     8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];


 

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Constructor
 */
function Uniform (options) {
    this.name = options.name;

}




/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 *
 * @author: Jean-Christophe Taveau
 */
function Bond(atom1, atom2)  {
  this.type  = Bond.NONE;
  this.atom1 = atom1;
  this.atom2 = atom2;
  this.middle = {
    'x': (this.atom1.x + this.atom2.x)/2.0,  
    'y': (this.atom1.y + this.atom2.y)/2.0,  
    'z': (this.atom1.z + this.atom2.z)/2.0,  
  };
}

Bond.NONE     = 0;
Bond.COVALENT = 1;
Bond.SSBOND   = 2;
Bond.HBOND    = 4;

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 *
 * @author: Jean-Christophe Taveau
 */
function BondCalculator(structure)  {

  var isDirty = true;
  var volume = {};
  var width  = 0;
  var height = 0;
  var depth  = 0;
  var cov_bonds = [];
  var h_bonds   = [];
  var ss_bonds  = [];


  function calcSubVolumes(mol) {
    var cube_side = 5.0 // 5 Angstroems
    width  = Math.round( (mol.bbox.max.x - mol.bbox.min.x) / cube_side);
    height = Math.round( (mol.bbox.max.y - mol.bbox.min.y) / cube_side);
    depth  = Math.round( (mol.bbox.max.z - mol.bbox.min.z) / cube_side);
                       
    for (var i in mol.atoms ) {
      var an_atom = mol.atoms[i];
      var cube = [];
      var x_cell = Math.floor( (an_atom.x - mol.bbox.min.x) / cube_side);
      var y_cell = Math.floor( (an_atom.y - mol.bbox.min.y) / cube_side);
      var z_cell = Math.floor( (an_atom.z - mol.bbox.min.z) / cube_side);
      var key = (x_cell + y_cell * width + z_cell * width * height);
      if (volume[key] == undefined) {
        // Create a new cube
        volume[key]={'key':key,'atoms':[]};
      }
      volume[key].atoms.push(an_atom);
    }
  }

  function calcAllBonds(mol) {
    console.log('calcAllBonds');
    for (var i in volume) {
      var cell = volume[i];
      for (var z = -1; z <= 1; z++) { 
        for (var y = -1; y <= 1; y++) {
          for (var x = -1; x <= 1; x++) {
            var key = volume[i].key + x+ y* width + z* width*height;
            if (volume[key] != undefined) {
              calcBonds(cell, volume[key]);
            }
          }
        }
      }
    }

    // open checkResult RasMol like !!
    console.log("covalent bonds .... " + cov_bonds.length);
    console.log("hydrogen bonds .... " + h_bonds.length);
    console.log("disulfide bonds ... " + ss_bonds.length);

    // close checkResult
    mol.bonds = cov_bonds;
    mol.hBonds = h_bonds;
    mol.ssBonds = ss_bonds;

/***
    for (var i in cov_bonds) {
      console.log('Bond['+cov_bonds[i].atom1.serial+';'+cov_bonds[i].atom2.serial+'] = '+'Bond['+cov_bonds[i].atom1.name+';'+cov_bonds[i].atom2.name+']');
    }
***/
  }

  function calcBonds(cell1, cell2 ) {
  for (var i in cell1.atoms) {
    var atom1 = cell1.atoms[i];
    for (var j in cell2.atoms) {
      var atom2 = cell2.atoms[j];
      if (atom1.serial < atom2.serial) {
        var flag = isBonded(atom1, atom2);
        switch (flag) {
        case Bond.COVALENT:
            var bond = new Bond(atom1, atom2);
            cov_bonds.push(bond);
          break;
        case Bond.HBOND:
            var bond = new Bond(atom1, atom2);
            h_bonds.push(bond);
          break;
        case Bond.SSBOND:
            var bond = new Bond(atom1, atom2);
            ss_bonds.push(bond);
          break;
        default:
          // Do nothing
        }
      } 
    } 
  }                 
}   
    
  function isBonded(at1, at2) {
  var minlength2 = 0.5 * 0.5;
  var maxlength2 = 1.9 * 1.9;
  var maxlength_sbond2 = 2.2 * 2.2;
  var maxlength_hbond2 = 3.5 * 3.5;
            
  var d2 = (at2.x - at1.x)*(at2.x - at1.x) + (at2.y - at1.y)*(at2.y - at1.y) + (at2.z - at1.z)*(at2.z - at1.z);

  if (at1.name === "SG" && at2.name === "SG" && d2 < maxlength_sbond2) {
    return Bond.SSBOND;
  }
  else if ( minlength2 < d2 && d2 < maxlength2) {
    return Bond.COVALENT;
  }
  else if ( (at1.name === "O" && at2.name === "N" && d2 < maxlength_hbond2 ) 
         || (at1.name === "N" && at2.name === "O" && d2 < maxlength_hbond2 )
         || (at1.name === "C" && at2.name === "O" && d2 < maxlength_hbond2 )
         || (at1.name === "O" && at2.name === "C" && d2 < maxlength_hbond2 ) ) {
    return Bond.HBOND;
  }
  else {
    return Bond.NONE;
  }
}

  // Main 
  calcSubVolumes(structure);
  calcAllBonds(structure);

}
   

 


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
 var MowgliViewer = function (canvasID) {
 
    // 0- Create a renderer for this canvas
    this.renderer = new Renderer(canvasID);

    // 1- Create a scene with a default light and camera
    this.scene = new Scene();
    this.renderer.addScene(scene);

    // 2- Update renderer
    this.renderer.update();

    // 3- Add a sensor
    var mouse = new MouseSensor(canvasID);
    this.mouse.attach(this.scene);

    this.renderer.addSensor(mouse);

 }
 
MowgliViewer.prototype.getScene = function () {
    return this.scene;
}


MowgliViewer.prototype.render = function () {
    this.renderer.drawScene();
}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/**
 * Constructor
 * @constructor
 **/
var Structure = function () {

  // General Information
  this.ID             = '0UNK';
  this.classification = 'Unknown';
  this.title          = 'No Title';
  this.date           = '00-UNK-00';

  // Atoms
  this.atoms=[];

  //Bonds
  this.bonds=[];

  // Colors
  this.colors = [];

  // Chains
  this.chains = [];

  // Center of Gravity
  this.cg={'x': 0.0,'y': 0.0,'z': 0.0};

  // Matrix for rotation(s) and translation(s)
  this.matrix=mat4.create();
  mat4.identity(this.matrix);

  // Bounding Box
  this.bbox={
    'min': {'x': Number.MAX_VALUE,'y': Number.MAX_VALUE,'z': Number.MAX_VALUE},
    'max': {'x': Number.MIN_VALUE,'y': Number.MIN_VALUE,'z': Number.MIN_VALUE},
    'center':  {'x': 0.0,'y': 0.0,'z': 0.0},
    'radius': 0.0
  };

}


Structure.RIGHT_HANDED_ALPHA = 1;
Structure.RIGHT_HANDED_OMEGA = 2;
Structure.RIGHT_HANDED_PI    = 3;
Structure.RIGHT_HANDED_GAMMA = 4;
Structure.RIGHT_HANDED_3_10  = 5;
Structure.LEFT_HANDED_ALPHA  = 6;
Structure.LEFT_HANDED_OMEGA  = 7;
Structure.LEFT_HANDED_GAMMA  = 8;
Structure.RIBBON_HELIX_2_7   = 9;
Structure.POLYPROLINE        = 10;

Structure.threeToOne = {
    "ALA" : "A", // Alanine
    "ARG" : "R", // Arginine
    "ASN" : "N", // Asparagine
    "ASP" : "D", // Aspartic_acid
    "CYS" : "C", // Cysteine
    "GLU" : "E", // Glutamic_acid
    "GLN" : "Q", // Glutamine
    "GLY" : "G", // Glycine
    "HIS" : "H", // Histidine
    "ILE" : "I", // Isoleucine
    "LEU" : "L", // Leucine
    "LYS" : "K", // Lysine
    "MET" : "M", // Methionine
    "PHE" : "F", // Phenylalanine
    "PRO" : "P", // Proline
    "SER" : "S", // Serine
    "THR" : "T", // Threonine
    "TRP" : "W", // Tryptophan
    "TYR" : "Y", // Tyrosine
    "VAL" : "V", // Valine
    "SEC" : "U", // Selenocysteine
    "PYL" : "O", // Pyrrolysine
    "ASX" : "B", // Asparagine_or_aspartic_acid
    "GLX" : "Z", // Glutamine_or_glutamic_acid
    "XLE" : "J", // Leucine_or_Isoleucine
    "XAA" : "X", // Unspecified_or_unknown_amino_acid
    "XXX" : "X"  // Unspecified_or_unknown_amino_acid
}

/**
 * Set Title
 *
 * @param{string} the new title
 *
 **/
Structure.prototype.setTitle = function (str) {
    this.title = str;
}

/**
 * Filter the atoms or bonds in function of their attributes
 *
 * @param{string} The type of objects (ATOM or BOND )on which the filter is applied
 * @param{function} A function for filtering
 *
 **/
Structure.prototype.finder = function (src,callback) {
  if (src === 'ATOM') {
    return this.atoms.filter(callback);
  }
  else {
    return this.bonds.filter(callback);     
  }
}

Structure.prototype.atomFinder = function (callback) {
  return this.atoms.filter(callback);
}

Structure.prototype.bondFinder = function (callback) {
  return this.bonds.filter(callback);
}

/**
 * Return the primary sequence in the FASTA format
 *
 * @return {string} The sequence in FASTA format
 *
 **/
Structure.prototype.fasta = function () {
    var fasta = '> ' + this.ID + ':' + this.atoms[0].chain + ' | ' + this.title + '\n';
    var current_chain = this.atoms[0].chainID;
    var count = 0;
    for (var i= 0; i < this.atoms.length; i++) {
        if (this.atoms[i].chainID != current_chain) {
            fasta += '\n> ' + this.ID + ':' + this.atoms[i].chain + ' | ' + this.title + '\n';
            current_chain = this.atoms[i].chainID;
            count = 0;
        }
        if (this.atoms[i].name==="CA" && this.atoms[i].chainID == current_chain) {
            fasta += Structure.threeToOne[this.atoms[i].group];
            count++;
            if ( (count % 80) == 0) {
                fasta += '\n';
                count = 0;
            }
        }
    }
    return fasta;
}

/**
 * Return the secondary structures in FASTA format -- if available.
 *
 * @return {string} The secondary structures of sequence in FASTA format
 *
 **/
Structure.prototype.secondary = function () {
    var fasta = '> ' + this.ID + ':' + this.atoms[0].chain + ' | ' + this.title + '\n';
    var current_chain = this.atoms[0].chainID;
    var count = 0;
    for (var i= 0; i < this.atoms.length; i++) {
        if (this.atoms[i].chainID != current_chain) {
            fasta += '\n> ' + this.ID + ':' + this.atoms[i].chain + ' | ' + this.title + '\n';
            current_chain = this.atoms[i].chainID;
            count = 0;
        }
        if (this.atoms[i].name==="CA" && this.atoms[i].chainID == current_chain) {
            fasta += this.atoms[i].struct[0];
            count++;
            if ( (count % 80) == 0) {
                fasta += '\n';
                count = 0;
            }
        }
    }
}


/**
 * Return the secondary structures in FASTA format -- if available.
 *
 * @return {string} The secondary structures of sequence in FASTA format
 *
 **/
Structure.prototype.calcPhiPsi = function () {
      var ca      = 0;
      var ca_next = 0;
      var points  = [];
      var names   = { 'N': 0, 'CA': 1, 'C': 2};
      var count   = 0;
      var gp      = 0; // current group index
      var ch      = ' '; // Current chain ID
      var oldPhi  = undefined;

    // Assume that the atoms are sorted by ascending index
    for (var i in this.atoms) {
    
        // New chain
        if (this.atoms[i].chain != ch) {
            if (ch != ' ') {
                // Last point of the current chain
                this.atoms[ca].phi = oldPhi;
                this.atoms[ca].psi = undefined;
            }
            // Reset variables
            oldPhi  = undefined;
            gp = this.atoms[i].groupID;
            ch = this.atoms[i].chain;
            count = 0;
        }
        
        // sort N, CA, C, N', CA', C' of the same chain
        if (this.atoms[i].chain == ch 
        &&  this.atoms[i].groupID >= gp 
        &&  this.atoms[i].groupID <= gp+1 
        && (this.atoms[i].name === 'N' || this.atoms[i].name === 'CA' || this.atoms[i].name === 'C' ) ) {
            var ii = (this.atoms[i].groupID - gp ) * 3 + names[this.atoms[i].name];
            if (ii == 1) {
                ca = i;
            }
            else if (ii == 4) {
                ca_next = i;
            }
            points[ii] = this.atoms[i];
            count++;
        }
        else if (count == 6){
            var angles=calcPhiPsi(points);
            this.atoms[ca].phi = oldPhi;
            this.atoms[ca].psi = angles[1];

            // Update variables for next group
            oldPhi=angles[0];
            gp=points[count-1].groupID;
            ca = ca_next;
            points[0]=points[3];
            points[1]=points[4];
            points[2]=points[5];
            count=3;
        }
    }
    // Last point of this chain
    this.atoms[ca].phi = oldPhi;
    this.atoms[ca].psi = undefined;

    
    function calcPhiPsi(points)
    {
      var psi=calcDihedralAngle(points[0],points[1],points[2],points[3]); // [0,1,2,3]);
      var phi=calcDihedralAngle(points[2],points[3],points[4],points[5]); // [2,3,4,5]);
      return [phi, psi];
    }


    function calcDihedralAngle(point0,point1,point2,point3) {
      // UA = (A2−A1) × (A3−A1) is orthogonal to plane A and UB = (B2−B1) × (B3−B1)  

      var v1 = vec3.fromValues(point1.x-point0.x,point1.y-point0.y, point1.z-point0.z); 
      var v2 = vec3.fromValues(point2.x-point1.x,point2.y-point1.y, point2.z-point1.z); 
      var v3 = vec3.fromValues(point3.x-point2.x,point3.y-point2.y, point3.z-point2.z); 
      var na=vec3.create();
      var nb=vec3.create();
      vec3.cross(na,v1,v2);
      vec3.cross(nb,v2,v3);
      var sinAngle=vec3.dot(v1,nb) * vec3.length(v2);
      var cosAngle=vec3.dot(na,nb);
      return Math.atan2(sinAngle,cosAngle)/Math.PI*180.0;
    }
}

Structure.prototype.toString = function () {
  var quote='';
  var out='{\n';

  for (var i in this.atoms)
  {
    out+="{";
    out+="type: '"  + this.atoms[i].type + "', " +
     "serial: " + this.atoms[i].serial + ", " +
     "name: '"  + this.atoms[i].name + "', " +
     "struct:'" + this.atoms[i].struct + "', " +
     "x :"    + this.atoms[i].x + ", " + 
     "y :"    + this.atoms[i].y + ", " + 
     "z :"    + this.atoms[i].z + ", " + 
     "symbol:'" + this.atoms[i].symbol + "'},\n ";
  }
  out+= 'center: {' + this.cg.x + ',y: '+ this.cg.y + ',z: '+ this.cg.z + '} } ';
  out+=("}\n");
  return out;
}


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

/*
 * Constructor
 */
var StructureReader = function () {

}

StructureReader.prototype.getFromDOM = function(document_id,format) {
  var text = document.getElementById(document_id).innerHTML;  
  var mol = this.createStructure(text,format);
  return mol;
}

StructureReader.prototype.getFromURL = function(url) {
  var extension = url.substr(url.length-3,url.length-1);
  console.log(extension);
  
  if (window.XMLHttpRequest)
  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    request=new XMLHttpRequest();
  }
  else
    alert('Please update your browser');
  try {
    request.open("GET",url,false);
    request.send();
  } catch (e) {
    alert(e.description);
  }
  
  var mol = this.createStructure(request.responseText,extension);
  return mol;
}

StructureReader.prototype.getFromID = function(pdb_id) {
  return this.getFromURL("http://www.rcsb.org/pdb/files/"+pdb_id+".pdb");

}

StructureReader.prototype.createStructure = function(text,format) {

  // 1- Choose the good parser
  var parser = null;

  if (format === 'pdb') {
    parser = new PDBParser();
  }
  else if (format === 'cif') {
    parser = new MMCIFParser();
  }
  else if (format === 'xml') {
    parser = new PDBMLParser();
  }
  else if (format === 'xyz') {
    parser = new XYZParser();
  }
  else {
  // Unknown format
  }
  
  // 2- Parse the file
  parser.parse(text); 
  var mol = parser.getStructure(); 

  // 3- Compute Bonds
  this.computeBonds(mol); 

  return mol;
}

StructureReader.prototype.computeBonds = function(a_mol) {
  // TODO
}




function MMCIFParser() {

}


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 *
 * @author: Jean-Christophe Taveau
 */

function PDBMLParser() {
    // TODO
}


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 *
 * @author: Jean-Christophe Taveau
 */
var PDBParser = function() {
  this.mol = new Structure();
  this.secondary = [];
  this.cubes = [];
  this.cube_side = 5.0; // 5 angstroems
}


PDBParser.TAGS = {
  'ANISOU': 0,
  'ATOM'  : 1,
  'AUTHOR': 2,
  'CAVEAT': 3,
  'CISPEP': 4,
  'COMPND': 5,
  'CONECT': 6,
  'CRYST1': 7,
  'DBREF1': 8,
  'DBREF2': 9,
  'DBREF' : 10,
  'END'   : 11,
  'ENDMDL': 12,
  'EXPDTA': 13,
  'FORMUL': 14,
  'HEADER': 15,
  'HELIX' : 16,
  'HET'   : 17,
  'HETATM': 18,
  'HETNAM': 19,
  'HETSYN': 20,
  'JRNL'  : 21,
  'KEYWDS': 22,
  'LINK'  : 23,
  'MASTER': 24,
  'MDLTYP': 25,
  'MODEL' : 26,
  'MODRES': 27,
  'MTRIX1': 28,
  'MTRIX2': 29,
  'MTRIX3': 30,
  'NUMMDL': 31,
  'OBSLTE': 32,
  'ORIGX1': 33,
  'ORIGX2': 34,
  'ORIGX3': 35,
  'REMARK': 36,
  'REVDAT': 37,
  'SCALE1': 38,
  'SCALE2': 39,
  'SCALE3': 40,
  'SEQADV': 41,
  'SEQRES': 42,
  'SHEET' : 43,
  'SITE'  : 44,
  'SOURCE': 45,
  'SPLT'  : 46,
  'SPRSDE': 47,
  'SSBOND': 48,
  'TER'   : 49,
  'TITLE' : 50
}

PDBParser.prototype.getStructure = function () {
  return this.mol;
}

PDBParser.prototype.parse = function (text) {
  // 1- Split the text in an array of rows
  var rows = text.split('\n');

  // 2- Main loop
  for (var i=0;i<rows.length;i++) {
    if (rows[i].length > 2) {
      var tag = PDBParser.TAGS[rows[i].substring(0,6).trim()];
      // console.log(rows[i].substring(0,6).trim()+' '+tag);
      switch (tag) {
      case PDBParser.TAGS.ATOM: 
      case PDBParser.TAGS.HETATM:
        this.parseAtom(rows[i]);
        break;
      case PDBParser.TAGS.END:
        this.postProcess();
        break;
      case PDBParser.TAGS.HEADER:
        this.parseHeader(rows[i]);
        break;
      case PDBParser.TAGS.HELIX:
        this.parseHelix(rows[i]);
        break;
      case PDBParser.TAGS.SHEET:
console.log("parse sheet");

        this.parseSheet(rows[i]);
        break;
      case PDBParser.TAGS.TITLE:
        this.parseTitle(rows[i]);
        break;
      default:
        // console.log('unimplemented tag = [' + rows[i].substring(0,6).trim()+']');
        // Do nothing
      }
    }
  }

  //  3- Finalization
  this.mol.cg.x/=this.mol.atoms.length;
  this.mol.cg.y/=this.mol.atoms.length;
  this.mol.cg.z/=this.mol.atoms.length;
  mat4.translate(this.mol.matrix,this.mol.matrix, [-this.mol.cg.x, -this.mol.cg.y, -this.mol.cg.z]);
  this.mol.bbox.center.x = (this.mol.bbox.min.x+this.mol.bbox.max.x)/2.0;
  this.mol.bbox.center.y = (this.mol.bbox.min.y+this.mol.bbox.max.y)/2.0;
  this.mol.bbox.center.z = (this.mol.bbox.min.z+this.mol.bbox.max.z)/2.0;
  this.mol.bbox.radius   = 
    (this.mol.bbox.min.x-this.mol.bbox.max.x)*(this.mol.bbox.min.x-this.mol.bbox.max.x)+
    (this.mol.bbox.min.y-this.mol.bbox.max.y)*(this.mol.bbox.min.y-this.mol.bbox.max.y)+
    (this.mol.bbox.min.z-this.mol.bbox.max.z)*(this.mol.bbox.min.z-this.mol.bbox.max.z);
  this.mol.bbox.radius   = Math.sqrt(this.mol.bbox.radius)/2.0;

  console.log('cg '+this.mol.cg.x+' '+this.mol.cg.y+' '+this.mol.cg.z);
  console.log(this.mol.atoms.length+' '+this.mol.bbox.radius+' '+this.mol.bbox.center.x+' '+this.mol.bbox.center.y+' '+this.mol.bbox.center.z);
}


/*
 *------------------------------------------------------------------------------------
 *COLUMNS       DATA  TYPE     FIELD             DEFINITION
 *------------------------------------------------------------------------------------
 * 1 -  6       Record name    "HEADER"
 *11 - 50       String(40)     classification    Classifies the molecule(s).
 *51 - 59       Date           depDate           Deposition date. This is the date the
 *                                               coordinates  were received at the PDB.
 *63 - 66       IDcode         idCode            This identifier is unique within the PDB.
 *------------------------------------------------------------------------------------
**/
PDBParser.prototype.parseHeader = function (row) {
  this.mol.classification = row.substring(10,50).trim();
  this.mol.date           = row.substring(50,59).trim();
  this.mol.ID             = row.substring(62,66).trim();
}


/*
-------------------------------------------------------------------------------------
COLUMNS        DATA  TYPE    FIELD        DEFINITION
-------------------------------------------------------------------------------------
 1 -  6        Record name   "ATOM  "
 7 - 11        Integer       serial       Atom  serial number.
13 - 16        Atom          name         Atom name.
17             Character     altLoc       Alternate location indicator.
18 - 20        Residue name  resName      Residue name.
22             Character     chainID      Chain identifier.
23 - 26        Integer       resSeq       Residue sequence number.
27             AChar         iCode        Code for insertion of residues.
31 - 38        Real(8.3)     x            Orthogonal coordinates for X in Angstroms.
39 - 46        Real(8.3)     y            Orthogonal coordinates for Y in Angstroms.
47 - 54        Real(8.3)     z            Orthogonal coordinates for Z in Angstroms.
55 - 60        Real(6.2)     occupancy    Occupancy.
61 - 66        Real(6.2)     tempFactor   Temperature  factor.
77 - 78        LString(2)    element      Element symbol, right-justified.
79 - 80        LString(2)    charge       Charge  on the atom.
-------------------------------------------------------------------------------------
*/

PDBParser.prototype.parseAtom = function (line) {
  var atom = {};
  atom.type = line.substring(0,6).trim();
  atom.serial = parseInt(line.substring(6,11));
  atom.name = line.substring(12,16).trim();
  atom.altLoc = line[16];
  atom.group = line.substring(17,20).trim();
  atom.chain = line[21];
  atom.groupID = parseInt(line.substring(22,26));
  atom.x = parseFloat(line.substring(30,38));
  atom.y = parseFloat(line.substring(38,46));
  atom.z = parseFloat(line.substring(46,54));
  atom.symbol = line.substring(76,78).trim();
  // If exists, set the secondary structure (previously parse in HELIX and SHEET)
  atom.secondary = 'X';
  var i = 0;
  while (i < this.secondary.length) {
    if (this.secondary[i].initChain === atom.chain && atom.groupID >= this.secondary[i].init && atom.groupID <= this.secondary[i].end ) {
      atom.secondary = this.secondary[i].type+'_'+this.secondary[i].strand+'['+this.secondary[i].serial+';'+this.secondary[i].ID+']';
      // Stop
      i = this.secondary.length;
    }
    i++;
  }

  this.mol.atoms.push(atom);

  // Update chain
  if (this.mol.chains.indexOf(atom.chain) == -1) {
    this.mol.chains.push(atom.chain);
  }
  // Update centroid and bounding box of the structure
  this.mol.cg.x += atom.x;
  this.mol.cg.y += atom.y;
  this.mol.cg.z += atom.z;
  this.updateBBox(atom);

}


PDBParser.prototype.parseHelix = function(row) {

  // HELIX
  /******
   1 -  6       Record name      "HELIX "
   8 - 10       Integer          serNum       Serial number of the helix. This starts at 1 and increases incrementally.
  12 - 14       LString(3)       helixID      Helix identifier.
  16 - 18       Residue name     initResName  Name of the initial residue.
  20            Character        initChainID  Chain identifier for the chain containing this helix.
  22 - 25       Integer          initSeqNum   Sequence number of the initial residue.
  26            AChar            initICode    Insertion code of the initial residue.
  28 - 30       Residue name     endResName   Name of the terminal residue of the helix.
  32            Character        endChainID   Chain identifier for the chain containing this helix.
  34 - 37       Integer          endSeqNum    Sequence number of the terminal residue.
  38            AChar            endICode     Insertion code of the terminal residue.
  39 - 40       Integer          helixClass   Helix class (see below).
  41 - 70       String           comment      Comment about this helix.
  72 - 76       Integer          length       Length of this helix.
  ******/


  this.secondary.push( {
    'type'      : 'H',
    'serial'    : parseInt(row.substring(7,10) ), 
    'ID'        : row.substring(11,14),
    'strand'    : '', 
    'initChain' : row[19], 
    'init'      : parseInt(row.substring(21,25) ), 
    'endChain'  : row[31], 
    'end'       : parseInt(row.substring(33,37) ), 
    'class'     : Structure.RIGHT_HANDED_ALPHA || parseInt(row.substring(38,40))
   });
/****
   console.log('HELIX:'+ 'H{' + this.secondary[this.secondary.length-1].ID +'}'+ 
     ' first:' + this.secondary[this.secondary.length-1].init + this.secondary[this.secondary.length-1].initChain + 
     ' last:'+ this.secondary[this.secondary.length-1].end + this.secondary[this.secondary.length-1].endChain);
*****/
}

  // SHEET: TODO
  /********************
   1 -  6        Record name   "SHEET "
   8 - 10        Integer       strand         Strand  number which starts at 1 for each strand within a sheet and increases by one.
  12 - 14        LString(3)    sheetID        Sheet  identifier.
  15 - 16        Integer       numStrands     Number  of strands in sheet.
  18 - 20        Residue name  initResName    Residue  name of initial residue.
  22             Character     initChainID    Chain identifier of initial residue in strand. 
  23 - 26        Integer       initSeqNum     Sequence number of initial residue in strand.
  27             AChar         initICode      Insertion code of initial residue in  strand.
  29 - 31        Residue name  endResName     Residue name of terminal residue.
  33             Character     endChainID     Chain identifier of terminal residue.
  34 - 37        Integer       endSeqNum      Sequence number of terminal residue.
  38             AChar         endICode       Insertion code of terminal residue.
  39 - 40        Integer       sense          Sense of strand with respect to previous strand. 0 if first strand, 1 if  parallel,and -1 if anti-parallel.
  42 - 45        Atom          curAtom        Registration.  Atom name in current strand.
  46 - 48        Residue name  curResName     Registration.  Residue name in current strand
  50             Character     curChainId     Registration. Chain identifier in current strand.
  51 - 54        Integer       curResSeq      Registration.  Residue sequence number in current strand.
  55             AChar         curICode       Registration. Insertion code in current strand.
  57 - 60        Atom          prevAtom       Registration.  Atom name in previous strand.
  61 - 63        Residue name  prevResName    Registration.  Residue name in previous strand.
  65             Character     prevChainId    Registration.  Chain identifier in previous  strand.
  66 - 69        Integer       prevResSeq     Registration. Residue sequence number in previous strand.
  70             AChar         prevICode      Registration.  Insertion code in previous strand.
  ****************/

PDBParser.prototype.parseSheet = function (row) {

  this.secondary.push( {
    'type'      : 'E',
    'serial'    : 'E',
    'ID'        : row.substring(11,14),
    'strand'    : parseInt(row.substring(7,10)),
    'initChain' : row[21], 
    'init'      : parseInt(row.substring(22,26) ), 
    'endChain'  : row[32], 
    'end'       : parseInt(row.substring(33,37) ),
    'sense'     : parseInt(row.substring(38,40) ), 
  });

}

/*
----------------------------------------------------------------------------------
COLUMNS       DATA  TYPE     FIELD         DEFINITION
----------------------------------------------------------------------------------
 1 -  6       Record name    "TITLE "
 9 - 10       Continuation   continuation  Allows concatenation of multiple records.
11 - 80       String         title         Title of the  experiment.
----------------------------------------------------------------------------------
*/

PDBParser.prototype.parseTitle = function (row) 
{
  if (parseInt(row.substring(8,10).trim()) == 1) {
    this.mol.title = row.substring(10,80).trim();
  }
  else {
    this.mol.title = ' ' + row.substring(10,80).trim();
  }
}

PDBParser.prototype.updateBBox = function (a) {
  if (this.mol.bbox.min.x > a.x)
    this.mol.bbox.min.x = a.x;
  if (this.mol.bbox.min.y > a.y)
    this.mol.bbox.min.y = a.y;
  if (this.mol.bbox.min.z > a.z)
    this.mol.bbox.min.z = a.z;
  if (this.mol.bbox.max.x < a.x)
    this.mol.bbox.max.x = a.x;
  if (this.mol.bbox.max.y < a.y)
    this.mol.bbox.max.y = a.y;
  if (this.mol.bbox.max.z < a.z)
    this.mol.bbox.max.z = a.z;
}

PDBParser.prototype.postProcess = function () {
  console.log('PostProcess');
  var bondCalc = new BondCalculator(this.mol);
}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 *
 * @author: Jean-Christophe Taveau
 */

function XYZParser() {
  this.mol = new Structure();
}

XYZParser.prototype.getStructure = function () {
  return this.mol;
}

/**
 * File format described in Wikipedia:
 * https://en.wikipedia.org/wiki/XYZ_file_format
 * Example from Wikipedia:
 *
 * 5
 * methane molecule (in Angströms)
 * C        0.000000        0.000000        0.000000
 * H        0.000000        0.000000        1.089000
 * H        1.026719        0.000000       -0.363000
 * H       -0.513360       -0.889165       -0.363000
 * H       -0.513360        0.889165       -0.363000
 *
 **/
XYZParser.prototype.parse = function (text) {
    // 1- Split the text in an array of rows
    var rows = text.split('\n');
    console.log(rows);
    // 2- Search for row #0
    var start = 0;
    while (/^\d+$/.test(rows[start]) == false) {
        start++;
    }
    // 3- Read title aka row #1
    this.mol.title = rows[start + 1];
    // 4- Main loop
    for (var i = start + 2; i < rows.length; i++) {
        if (rows[i] !== undefined && rows[i].length > 0) {
            this.parseAtom(rows[i],i - 1 - start);
        }
    }
}



XYZParser.prototype.parseAtom = function (line, row_number) {
  var words = line.match(/(\S+)/g);
  console.log(words);
  var atom = {};
  atom.type = "ATOM";
  atom.serial = row_number;
  atom.name = words[0].trim();
  atom.group = "XXX";
  atom.chain = "A";
  atom.groupID = 1;
  atom.x = parseFloat(words[1].trim());
  atom.y = parseFloat(words[2].trim());
  atom.z = parseFloat(words[3].trim());
  atom.symbol = atom.name;
  // If exists, set the secondary structure (previously parse in HELIX and SHEET)
  atom.secondary = 'X';
  this.mol.atoms.push(atom);

  // Update centroid and bounding box of the structure
  this.mol.cg.x += atom.x;
  this.mol.cg.y += atom.y;
  this.mol.cg.z += atom.z;
  this.updateBBox(atom);

}
XYZParser.prototype.updateBBox = function (a) {
  if (this.mol.bbox.min.x > a.x)
    this.mol.bbox.min.x = a.x;
  if (this.mol.bbox.min.y > a.y)
    this.mol.bbox.min.y = a.y;
  if (this.mol.bbox.min.z > a.z)
    this.mol.bbox.min.z = a.z;
  if (this.mol.bbox.max.x < a.x)
    this.mol.bbox.max.x = a.x;
  if (this.mol.bbox.max.y < a.y)
    this.mol.bbox.max.y = a.y;
  if (this.mol.bbox.max.z < a.z)
    this.mol.bbox.max.z = a.z;
}

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"


/*****
Code 	colour Name 	Sample 	RGB Values 	Hexadecimal
LG 	Light Grey 	[200,200,200] 	C8C8C8
SB 	Sky Blue 	[143,143,255] 	8F8FFF
R 	Red 	  	[240, 0, 0] 	F00000
Y 	Yellow 	  	[255,200, 50] 	FFC832
W 	White 	  	[255,255,255] 	FFFFFF
Pk 	Pink 	  	[255,192,203] 	FFC0CB
Go 	Golden Rod 	[218,165, 32] 	DAA520
Bl 	Blue 	  	[ 0, 0,255] 	0000FF
Or 	Orange 	  	[255,165, 0] 	FFA500
DG 	Dark Grey 	[128,128,144] 	808090
Br 	Brown 	  	[165, 42, 42] 	A52A2A
P 	Purple 	  	[160, 32,240] 	A020F0
DP 	Deep Pink 	[255, 20,147] 	FF1493
G 	Green 	  	[ 0,255, 0] 	00FF00
FB 	Fire Brick 	[178, 34, 34] 	B22222
FG 	Forest Green 	[ 34,139, 34] 	228B22
****/

var symbols = { 
  '_' : { 'symbol':''  ,'unknown': 180, 'vdwRadius': 360, 'value2': 12, 'name': ""            ,'color':[255, 20,147]},  /*   0 */
  'H' : { 'symbol':'H' ,'unknown':  80, 'vdwRadius': 275, 'value2':  4, 'name': "HYDROGEN"    ,'color':[255, 20,147]},  /*   1 */
  'HE': { 'symbol':'He','unknown': 400, 'vdwRadius': 550, 'value2':  5, 'name': "HELIUM"      ,'color':[255,192,203]},  /*   2 */
  'LI': { 'symbol':'Li','unknown': 170, 'vdwRadius': 305, 'value2': 14, 'name': "LITHIUM"     ,'color':[255, 20,147]},  /*   3 */
  'BE': { 'symbol':'Be','unknown':  88, 'vdwRadius': 157, 'value2': 12, 'name': "BERYLLIUM"   ,'color':[255, 20,147]},  /*   4 */
  'B' : { 'symbol':'B' ,'unknown': 208, 'vdwRadius': 387, 'value2': 13, 'name': "BORON"       ,'color':[  0,255,  0]},  /*   5 */
  'C' : { 'symbol':'C' ,'unknown': 180, 'vdwRadius': 387, 'value2':  0, 'name': "CARBON"      ,'color':[255, 20,147]},  /*   6 */
  'N' : { 'symbol':'N' ,'unknown': 170, 'vdwRadius': 350, 'value2':  1, 'name': "NITROGEN"    ,'color':[255, 20,147]},  /*   7 */
  'O' : { 'symbol':'O' ,'unknown': 170, 'vdwRadius': 337, 'value2':  2, 'name': "OXYGEN"      ,'color':[255, 20,147]},  /*   8 */
  'F' : { 'symbol':'F' ,'unknown': 160, 'vdwRadius': 325, 'value2':  6, 'name': "FLUORINE"    ,'color':[255, 20,147]},  /*   9 */
  'N' : { 'symbol':'N' ,'unknown': 280, 'vdwRadius': 505, 'value2': 12, 'name': "NEON"        ,'color':[255, 20,147]},  /*  10 */
  'NA': { 'symbol':'Na','unknown': 243, 'vdwRadius': 550, 'value2':  7, 'name': "SODIUM"      ,'color':[255, 20,147]},  /*  11 */
  'MG': { 'symbol':'Mg','unknown': 275, 'vdwRadius': 375, 'value2': 15, 'name': "MAGNESIUM"   ,'color':[255, 20,147]},  /*  12 */
  'AL': { 'symbol':'Al','unknown': 338, 'vdwRadius': 375, 'value2':  9, 'name': "ALUMINIUM"   ,'color':[255, 20,147]},  /*  13 */
  'SI': { 'symbol':'Si','unknown': 300, 'vdwRadius': 550, 'value2':  6, 'name': "SILICON"     ,'color':[255, 20,147]},  /*  14 */
  'P' : { 'symbol':'P' ,'unknown': 259, 'vdwRadius': 470, 'value2':  8, 'name': "PHOSPHORUS"  ,'color':[255,165,  0]},  /*  15 */  /* 262? */
  'S' : { 'symbol':'S' ,'unknown': 255, 'vdwRadius': 452, 'value2':  3, 'name': "SULPHUR"     ,'color':[255,200, 50]},  /*  16 */
  'CL': { 'symbol':'Cl','unknown': 250, 'vdwRadius': 437, 'value2': 13, 'name': "CHLORINE"    ,'color':[  0,255,  0]},  /*  17 */
  'AR': { 'symbol':'Ar','unknown': 392, 'vdwRadius': 692, 'value2': 12, 'name': "ARGON"       ,'color':[255, 20,147]},  /*  18 */
  'K' : { 'symbol':'K' ,'unknown': 332, 'vdwRadius': 597, 'value2': 12, 'name': "POTASSIUM"   ,'color':[255, 20,147]},  /*  19 */
  'CA': { 'symbol':'Ca','unknown': 248, 'vdwRadius': 487, 'value2':  9, 'name': "CALCIUM"     ,'color':[255, 20,147]},  /*  20 */
  'SC': { 'symbol':'Sc','unknown': 360, 'vdwRadius': 330, 'value2': 12, 'name': "SCANDIUM"    ,'color':[255, 20,147]},  /*  21 */
  'TI': { 'symbol':'Ti','unknown': 368, 'vdwRadius': 487, 'value2':  9, 'name': "TITANIUM"    ,'color':[255, 20,147]},  /*  22 */
  'V' : { 'symbol':'V' ,'unknown': 332, 'vdwRadius': 265, 'value2': 12, 'name': "VANADIUM"    ,'color':[255, 20,147]},  /*  23 */
  'CR': { 'symbol':'Cr','unknown': 338, 'vdwRadius': 282, 'value2':  9, 'name': "CHROMIUM"    ,'color':[255, 20,147]},  /*  24 */
  'MN': { 'symbol':'Mn','unknown': 338, 'vdwRadius': 297, 'value2':  9, 'name': "MANGANESE"   ,'color':[255, 20,147]},  /*  25 */
  'FE': { 'symbol':'Fe','unknown': 335, 'vdwRadius': 487, 'value2':  8, 'name': "IRON"        ,'color':[255, 20,147]},  /*  26 */
  'CO': { 'symbol':'Co','unknown': 332, 'vdwRadius': 282, 'value2': 12, 'name': "COBALT"      ,'color':[255, 20,147]},  /*  27 */
  'NI': { 'symbol':'Ni','unknown': 405, 'vdwRadius': 310, 'value2': 10, 'name': "NICKEL"      ,'color':[255, 20,147]},  /*  28 */  /* >375! */
  'CU': { 'symbol':'Cu','unknown': 380, 'vdwRadius': 287, 'value2': 10, 'name': "COPPER"      ,'color':[255, 20,147]},  /*  29 */
  'ZN': { 'symbol':'Zn','unknown': 362, 'vdwRadius': 287, 'value2': 10, 'name': "ZINC"        ,'color':[255, 20,147]},  /*  30 */
  'GA': { 'symbol':'Ga','unknown': 305, 'vdwRadius': 387, 'value2': 12, 'name': "GALLIUM"     ,'color':[255, 20,147]},  /*  31 */
  'GE': { 'symbol':'Ge','unknown': 292, 'vdwRadius': 999, 'value2': 12, 'name': "GERMANIUM"   ,'color':[255, 20,147]},  /*  32 */  /* 1225? */
  'AS': { 'symbol':'As','unknown': 302, 'vdwRadius': 207, 'value2': 12, 'name': "ARSENIC"     ,'color':[255, 20,147]},  /*  33 */
  'SE': { 'symbol':'Se','unknown': 305, 'vdwRadius': 225, 'value2': 12, 'name': "SELENIUM"    ,'color':[255, 20,147]},  /*  34 */
  'BR': { 'symbol':'Br','unknown': 302, 'vdwRadius': 437, 'value2': 10, 'name': "BROMINE"     ,'color':[255, 20,147]},  /*  35 */
  'KR': { 'symbol':'Kr','unknown': 400, 'vdwRadius': 475, 'value2': 12, 'name': "KRYPTON"     ,'color':[255, 20,147]},  /*  36 */
  'RB': { 'symbol':'Rb','unknown': 368, 'vdwRadius': 662, 'value2': 12, 'name': "RUBIDIUM"    ,'color':[255, 20,147]},  /*  37 */
  'SR': { 'symbol':'Sr','unknown': 280, 'vdwRadius': 505, 'value2': 12, 'name': "STRONTIUM"   ,'color':[255, 20,147]},  /*  38 */
  'Y' : { 'symbol':'Y' ,'unknown': 445, 'vdwRadius': 402, 'value2': 12, 'name': "YTTRIUM"     ,'color':[255, 20,147]},  /*  39 */
  'ZR': { 'symbol':'Zr','unknown': 390, 'vdwRadius': 355, 'value2': 12, 'name': "ZIRCONIUM"   ,'color':[255, 20,147]},  /*  40 */
  'NB': { 'symbol':'Nb','unknown': 370, 'vdwRadius': 332, 'value2': 12, 'name': "NIOBIUM"     ,'color':[255, 20,147]},  /*  41 */
  'MO': { 'symbol':'Mo','unknown': 368, 'vdwRadius': 437, 'value2': 12, 'name': "MOLYBDENUM"  ,'color':[255, 20,147]},  /*  42 */
  'TC': { 'symbol':'Tc','unknown': 338, 'vdwRadius': 450, 'value2': 12, 'name': "TECHNETIUM"  ,'color':[255, 20,147]},  /*  43 */
  'RU': { 'symbol':'Ru','unknown': 350, 'vdwRadius': 300, 'value2': 12, 'name': "RUTHENIUM"   ,'color':[255, 20,147]},  /*  44 */
  'RH': { 'symbol':'Rh','unknown': 362, 'vdwRadius': 305, 'value2': 12, 'name': "RHODIUM"     ,'color':[255, 20,147]},  /*  45 */
  'PD': { 'symbol':'Pd','unknown': 375, 'vdwRadius': 360, 'value2': 12, 'name': "PALLADIUM"   ,'color':[255, 20,147]},  /*  46 */
  'AG': { 'symbol':'Ag','unknown': 398, 'vdwRadius': 387, 'value2':  9, 'name': "SILVER"      ,'color':[255, 20,147]},  /*  47 */
  'CD': { 'symbol':'Cd','unknown': 422, 'vdwRadius': 437, 'value2': 12, 'name': "CADMIUM"     ,'color':[255, 20,147]},  /*  48 */
  'IN': { 'symbol':'In','unknown': 408, 'vdwRadius': 362, 'value2': 12, 'name': "INDIUM"      ,'color':[255, 20,147]},  /*  49 */
  'SN': { 'symbol':'Sn','unknown': 365, 'vdwRadius': 417, 'value2': 12, 'name': "TIN"         ,'color':[255, 20,147]},  /*  50 */
  'SB': { 'symbol':'Sb','unknown': 365, 'vdwRadius': 280, 'value2': 12, 'name': "ANTIMONY"    ,'color':[255, 20,147]},  /*  51 */
  'TE': { 'symbol':'Te','unknown': 368, 'vdwRadius': 315, 'value2': 12, 'name': "TELLURIUM"   ,'color':[255, 20,147]},  /*  52 */
  'I' : { 'symbol':'I' ,'unknown': 350, 'vdwRadius': 437, 'value2': 11, 'name': "IODINE"      ,'color':[255, 20,147]},  /*  53 */
  'XE': { 'symbol':'Xe','unknown': 425, 'vdwRadius': 525, 'value2': 12, 'name': "XENON"       ,'color':[255, 20,147]},  /*  54 */
  'CS': { 'symbol':'Cs','unknown': 418, 'vdwRadius': 752, 'value2': 12, 'name': "CAESIUM"     ,'color':[255, 20,147]},  /*  55 */
  'BA': { 'symbol':'Ba','unknown': 335, 'vdwRadius': 602, 'value2':  8, 'name': "BARIUM"      ,'color':[255, 20,147]},  /*  56 */
  'LA': { 'symbol':'La','unknown': 468, 'vdwRadius': 457, 'value2': 12, 'name': "LANTHANUM"   ,'color':[255, 20,147]},  /*  57 */
  'CE': { 'symbol':'Ce','unknown': 458, 'vdwRadius': 465, 'value2': 12, 'name': "CERIUM"      ,'color':[255, 20,147]},  /*  58 */
  'PR': { 'symbol':'Pr','unknown': 455, 'vdwRadius': 405, 'value2': 12, 'name': "PRASEODYMIUM",'color':[255, 20,147]},  /*  59 */
  'ND': { 'symbol':'Nd','unknown': 452, 'vdwRadius': 447, 'value2': 12, 'name': "NEODYMIUM"   ,'color':[255, 20,147]},  /*  60 */
  'PM': { 'symbol':'Pm','unknown': 450, 'vdwRadius': 440, 'value2': 12, 'name': "PROMETHIUM"  ,'color':[255, 20,147]},  /*  61 */
  'SM': { 'symbol':'Sm','unknown': 450, 'vdwRadius': 435, 'value2': 12, 'name': "SAMARIUM"    ,'color':[255, 20,147]},  /*  62 */
  'EU': { 'symbol':'Eu','unknown': 498, 'vdwRadius': 490, 'value2': 12, 'name': "EUROPIUM"    ,'color':[255, 20,147]},  /*  63 */
  'GD': { 'symbol':'Gd','unknown': 448, 'vdwRadius': 422, 'value2': 12, 'name': "GADOLINIUM"  ,'color':[255, 20,147]},  /*  64 */
  'TD': { 'symbol':'Tb','unknown': 440, 'vdwRadius': 415, 'value2': 12, 'name': "TERBIUM"     ,'color':[255, 20,147]},  /*  65 */
  'DY': { 'symbol':'Dy','unknown': 438, 'vdwRadius': 407, 'value2': 12, 'name': "DYSPROSIUM"  ,'color':[255, 20,147]},  /*  66 */
  'HO': { 'symbol':'Ho','unknown': 435, 'vdwRadius': 402, 'value2': 12, 'name': "HOLMIUM"     ,'color':[255, 20,147]},  /*  67 */
  'ER': { 'symbol':'Er','unknown': 432, 'vdwRadius': 397, 'value2': 12, 'name': "ERBIUM"      ,'color':[255, 20,147]},  /*  68 */
  'TM': { 'symbol':'Tm','unknown': 430, 'vdwRadius': 392, 'value2': 12, 'name': "THULIUM"     ,'color':[255, 20,147]},  /*  69 */
  'YB': { 'symbol':'Yb','unknown': 485, 'vdwRadius': 385, 'value2': 12, 'name': "YTTERBIUM"   ,'color':[255, 20,147]},  /*  70 */
  'LU': { 'symbol':'Lu','unknown': 430, 'vdwRadius': 382, 'value2': 12, 'name': "LUTETIUM"    ,'color':[255, 20,147]},  /*  71 */
  'HF': { 'symbol':'Hf','unknown': 392, 'vdwRadius': 350, 'value2': 12, 'name': "HAFNIUM"     ,'color':[255, 20,147]},  /*  72 */
  'TA': { 'symbol':'Ta','unknown': 358, 'vdwRadius': 305, 'value2': 12, 'name': "TANTALUM"    ,'color':[255, 20,147]},  /*  73 */
  'W' : { 'symbol':'W' ,'unknown': 342, 'vdwRadius': 315, 'value2': 12, 'name': "TUNGSTEN"    ,'color':[255, 20,147]},  /*  74 */
  'RE': { 'symbol':'Re','unknown': 338, 'vdwRadius': 325, 'value2': 12, 'name': "RHENIUM"     ,'color':[255, 20,147]},  /*  75 */
  'OS': { 'symbol':'Os','unknown': 342, 'vdwRadius': 395, 'value2': 12, 'name': "OSMIUM"      ,'color':[255, 20,147]},  /*  76 */
  'IR': { 'symbol':'Ir','unknown': 330, 'vdwRadius': 305, 'value2': 12, 'name': "IRIDIUM"     ,'color':[255, 20,147]},  /*  77 */
  'PT': { 'symbol':'Pt','unknown': 375, 'vdwRadius': 387, 'value2': 12, 'name': "PLATINUM"    ,'color':[255, 20,147]},  /*  78 */
  'AU': { 'symbol':'Au','unknown': 375, 'vdwRadius': 362, 'value2':  6, 'name': "GOLD"        ,'color':[255, 20,147]},  /*  79 */
  'HG': { 'symbol':'Hg','unknown': 425, 'vdwRadius': 495, 'value2': 12, 'name': "MERCURY"     ,'color':[255, 20,147]},  /*  80 */
  'TL': { 'symbol':'Tl','unknown': 388, 'vdwRadius': 427, 'value2': 12, 'name': "THALLIUM"    ,'color':[255, 20,147]},  /*  81 */
  'PB': { 'symbol':'Pb','unknown': 385, 'vdwRadius': 540, 'value2': 12, 'name': "LEAD"        ,'color':[255, 20,147]},  /*  82 */
  'BI': { 'symbol':'Bi','unknown': 385, 'vdwRadius': 432, 'value2': 12, 'name': "BISMUTH"     ,'color':[255, 20,147]},  /*  83 */
  'PO': { 'symbol':'Po','unknown': 420, 'vdwRadius': 302, 'value2': 12, 'name': "POLONIUM"    ,'color':[255, 20,147]},  /*  84 */
  'AT': { 'symbol':'At','unknown': 302, 'vdwRadius': 280, 'value2': 12, 'name': "ASTATINE"    ,'color':[255, 20,147]},  /*  85 */
  'RN': { 'symbol':'Rn','unknown': 475, 'vdwRadius': 575, 'value2': 12, 'name': "RADON"       ,'color':[255, 20,147]},  /*  86 */
  'FR': { 'symbol':'Fr','unknown': 450, 'vdwRadius': 810, 'value2': 12, 'name': "FRANCIUM"    ,'color':[255, 20,147]},  /*  87 */
  'RA': { 'symbol':'Ra','unknown': 358, 'vdwRadius': 642, 'value2': 12, 'name': "RADIUM"      ,'color':[255, 20,147]},  /*  88 */
  'AC': { 'symbol':'Ac','unknown': 295, 'vdwRadius': 530, 'value2': 12, 'name': "ACTINIUM"    ,'color':[255, 20,147]},  /*  89 */
  'TH': { 'symbol':'Th','unknown': 255, 'vdwRadius': 460, 'value2': 12, 'name': "THORIUM"     ,'color':[255, 20,147]},  /*  90 */
  'PA': { 'symbol':'Pa','unknown': 222, 'vdwRadius': 400, 'value2': 12, 'name': "PROTACTINIUM",'color':[255, 20,147]},  /*  91 */
  'U' : { 'symbol':'U' ,'unknown': 242, 'vdwRadius': 437, 'value2': 12, 'name': "URANIUM"     ,'color':[255, 20,147]},  /*  92 */
  'NP': { 'symbol':'Np','unknown': 238, 'vdwRadius': 427, 'value2': 12, 'name': "NEPTUNIUM"   ,'color':[255, 20,147]},  /*  93 */
  'PU': { 'symbol':'Pu','unknown': 232, 'vdwRadius': 417, 'value2': 12, 'name': "PLUTONIUM"   ,'color':[255, 20,147]},  /*  94 */
  'AM': { 'symbol':'Am','unknown': 230, 'vdwRadius': 415, 'value2': 12, 'name': "AMERICIUM"   ,'color':[255, 20,147]},  /*  95 */
  'CM': { 'symbol':'Cm','unknown': 228, 'vdwRadius': 412, 'value2': 12, 'name': "CURIUM"      ,'color':[255, 20,147]},  /*  96 */
  'BK': { 'symbol':'Bk','unknown': 225, 'vdwRadius': 410, 'value2': 12, 'name': "BERKELIUM"   ,'color':[255, 20,147]},  /*  97 */
  'CF': { 'symbol':'Cf','unknown': 222, 'vdwRadius': 407, 'value2': 12, 'name': "CALIFORNIUM" ,'color':[255, 20,147]},  /*  98 */
  'ES': { 'symbol':'Es','unknown': 220, 'vdwRadius': 405, 'value2': 12, 'name': "EINSTEINIUM" ,'color':[255, 20,147]},  /*  99 */
  'FM': { 'symbol':'Fm','unknown': 218, 'vdwRadius': 402, 'value2': 12, 'name': "FERMIUM"     ,'color':[255, 20,147]},  /* 100 */
  'MD': { 'symbol':'Md','unknown': 215, 'vdwRadius': 400, 'value2': 12, 'name': "MENDELEVIUM" ,'color':[255, 20,147]},  /* 101 */
  'NO': { 'symbol':'No','unknown': 212, 'vdwRadius': 397, 'value2': 12, 'name': "NOBELIUM"    ,'color':[255, 20,147]},  /* 102 */
  'LR': { 'symbol':'Lr','unknown': 210, 'vdwRadius': 395, 'value2': 12, 'name': "LAWRENCIUM"  ,'color':[255, 20,147]}  /* 103 */ /* Lw? */
}; 


/******
Nucleic
Backbone (the atoms of the sugar phosphate backbone)
AT
CG
Purine
Pyrimidine

Protein
Alpha (carbon = *.CA)
Amino (atoms present in aminoacids == Protein)
Backbone (atoms N-CA-C-O or the atoms of the sugar phosphate backbone)
 
Hydrogen

Bonded
Cystine
Helix
Sheet
Turn

Hetero
Ions
Ligand
Water

Selected

Sidechain
Solvent

****************/

//props
// protein/nucleic,acidic, acyclic, aliphatic, aromatic, basic, buried, charged, cyclic, hydrophobic, large, medium, negative, neutral, polar, positive, small, surface,AT,CG,purine,pyrimidine
var groups = {
'ALA': {'3code': 'ALA','1code':'A','props':"01100100100010010"},
'ARG': {'3code': 'ARG','1code':'R','props':"01001010010001101"},
'ASN': {'3code': 'ASN','1code':'N','props':"01000000001011001"},
'ASP': {'3code': 'ASP','1code':'D','props':"11000010001101001"},
'CYS': {'3code': 'CYS','1code':'C','props':"01000100001011000"},


'DA ': {'3code': 'DA ','1code':'1','props':"000000000000000001010"},
};

/**************************************
Residues:	ala	arg	asn	asp	cys	glu	gln	gly	his	ile	leu	lys	met	phe	pro	ser	thr	trp	tyr	val
	A	R	N	D	C	E	Q	G	H	I	L	K	M	F	P	S	T	W	Y	V
Predefined Set	
	A	R	N	D	C	E	Q	G	H	I	L	K	M	F	P	S	T	W	Y	V
acidic 				*		*														
acyclic 	*	*	* 	*	*	*	* 	*		*	* 	*	*			*	*			*
aliphatic 	*							*		*	* 									*
aromatic 									*					*				*	* 	
basic 		*							*			*								
buried 	*				*					*	* 		*	*				*		*
charged 		*		*		*			*			*								
cyclic 									*					*	* 			*	* 	
hydrophobic	*							*		*	* 		*	*	* 			*	* 	*
large 		*				*	* 		*	*	* 	*	*	*				*	* 	
medium 			* 	*	*										* 		*			*
negative 				*		*														
neutral 	*		* 		*		* 	*	*	*	* 		*	*	* 	*	*	*	* 	*
polar 		*	* 	*	*	*	* 		*			*				*	*			
positive 		*							*			*								
small 	*							*								*				
surface 		*	* 	*		*	* 	*	*			*			* 	*	*		* 	


***************************************/

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
var PointStyle = function (options) {
  this.structure = options.structure;
  this.context = options.context;
  this.VBO = null;
  this.isDirty = true;
}

PointStyle.prototype.getShape = function() {
  var shape = null;
  if (this.isDirty ) {
    this.createVBO();
    shape = new Shape();
    shape.VBO = this.VBO;
  }
  return shape;
}

PointStyle.prototype.createGeometry = function(structure) {
  var vertices = [];
  for (var i in structure.atoms) {
    vertices.push(structure.atoms[i].x);
    vertices.push(structure.atoms[i].y);
    vertices.push(structure.atoms[i].z);
  }
  return new Float32Array(vertices);
}

PointStyle.prototype.createVBO = function() {
  var gl = this.context;

  // Create Geometry
  var geom = this.createGeometry(this.structure);
  // Create VBO
  this.VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
  gl.bufferData(gl.ARRAY_BUFFER, geom, gl.STATIC_DRAW);

  this.VBO.itemSize = 3;
  this.VBO.numItems = this.structure.atoms.length;

  this.isDirty = false;
}


/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */
 
 function Wireframe() {
 
 }
 

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

"use strict"

/*
 * Constructor
 */

function Console() {

}

/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 
"use strict"

function EventManager() {

}


EventManager.prototype.add = function(type, a_callback) {


}



/*
 *  mowgli: Molecule WebGL Viewer in JavaScript, html5, css3, and WebGL
 *  Copyright (C) 2015  Jean-Christophe Taveau.
 *
 *  This file is part of mowgli
 *
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


"use strict"

/*
 * Singleton ??
 */
function MouseSensor(canvas_id) {
  var mousePosition=[0.0,0.0];
  var currentAngle=[0.0,0.0];
  
  var lastX = -1;
  var lastY = -1;
  var dragging = false;

  var zoom = 0;
  var zoomDelta=0.01;

  var canvas = document.getElementById(canvas_id);

  var shapes = [];
  var renderer = null;

/***
  canvas.onmousewheel = function(event) {
    console.log(event.wheelDelta);
    zoom+=(zoomDelta*event.wheelDelta/Math.abs(event.wheelDelta) );
    // Display
    renderer.drawScene();
    event.preventDefault();
  }
***/
 
  canvas.onmousedown = function(ev) {  
   //Mouse is pressed
     var x = ev.clientX;
     var y = ev.clientY;
 
     var rect = ev.target.getBoundingClientRect();
     if(rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
       lastX = x;
       lastY = y;
       mousePosition[0] = x;
       mousePosition[1] = canvas.height - y;
       dragging = true;
 
     }
   };
 
  canvas.onmouseup = function(ev){ 
  //Mouse is released
     dragging = false;
   }
 
  canvas.onmousemove = function(ev) { 
  //Mouse is moved
     var x = ev.clientX;
     var y = ev.clientY;
     if(dragging) {
       //put some kind of dragging logic in here
       //Here is a rotation example
       var factor = 0.05;
       var dx = factor * (x - lastX);
       var dy = factor * (y - lastY);
       //Limit x-axis rotation angle to -90 to 90 degrees
       currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90), -90);
       currentAngle[1] = currentAngle[1] + dx;
 
       mousePosition[0] = x;
       mousePosition[1] = canvas.height - y;
 
      // Update shape(s) matrix 
      console.log(currentAngle[0]+ ' '+ currentAngle[1])
      var tmp = mat4.create();
      mat4.identity(tmp);
      mat4.rotate(tmp,tmp,dx,[0,1,0]);
      mat4.rotate(tmp,tmp,dy,[1,0,0]);

      // Apply rotation to each registered shape
      for (var i in shapes) {
        mat4.multiply(shapes[i].matrix,tmp,shapes[i].matrix);
      }

      // Display
      renderer.drawScene();
     }
     lastX = x;
     lastY = y;
 
   }

  return {
    attach : function (a_shape) {
      shapes.push(a_shape);
    },
    
    setRenderer : function (a_renderer) {
      renderer = a_renderer;
    }
  };
}

