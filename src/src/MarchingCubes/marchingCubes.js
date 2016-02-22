// Marching Cubes
// Jean-Christophe Taveau
// http://crazybiocomputing.blogspot.com
// Nov 2014
// Updated 11/25/2014: Bug fixes

// triangles to be drawn in each case
var triangles=[
[],
[0,8,3],
[0,1,9],
[1,8,3,9,8,1],
[1,2,11],
[0,8,3,1,2,11],
[9,2,11,0,2,9],
[2,8,3,2,11,8,11,9,8],
[3,10,2],
[0,10,2,8,10,0],
[1,9,0,2,3,10],
[1,10,2,1,9,10,9,8,10],
[3,11,1,10,11,3],
[0,11,1,0,8,11,8,10,11],
[3,9,0,3,10,9,10,11,9],
[9,8,11,11,8,10],
[4,7,8],
[4,3,0,7,3,4],
[0,1,9,8,4,7],
[4,1,9,4,7,1,7,3,1],
[1,2,11,8,4,7],
[3,4,7,3,0,4,1,2,11],
[9,2,11,9,0,2,8,4,7],
[2,11,9,2,9,7,2,7,3,7,9,4],
[8,4,7,3,10,2],
[10,4,7,10,2,4,2,0,4],
[9,0,1,8,4,7,2,3,10],
[4,7,10,9,4,10,9,10,2,9,2,1],
[3,11,1,3,10,11,7,8,4],
[1,10,11,1,4,10,1,0,4,7,10,4],
[4,7,8,9,0,10,9,10,11,10,0,3],
[4,7,10,4,10,9,9,10,11],
[9,5,4],
[9,5,4,0,8,3],
[0,5,4,1,5,0],
[8,5,4,8,3,5,3,1,5],
[1,2,11,9,5,4],
[3,0,8,1,2,11,4,9,5],
[5,2,11,5,4,2,4,0,2],
[2,11,5,3,2,5,3,5,4,3,4,8],
[9,5,4,2,3,10],
[0,10,2,0,8,10,4,9,5],
[0,5,4,0,1,5,2,3,10],
[2,1,5,2,5,8,2,8,10,4,8,5],
[11,3,10,11,1,3,9,5,4],
[4,9,5,0,8,1,8,11,1,8,10,11],
[5,4,0,5,0,10,5,10,11,10,0,3],
[5,4,8,5,8,11,11,8,10],
[9,7,8,5,7,9],
[9,3,0,9,5,3,5,7,3],
[0,7,8,0,1,7,1,5,7],
[1,5,3,3,5,7],
[9,7,8,9,5,7,11,1,2],
[11,1,2,9,5,0,5,3,0,5,7,3],
[8,0,2,8,2,5,8,5,7,11,5,2],
[2,11,5,2,5,3,3,5,7],
[7,9,5,7,8,9,3,10,2],
[9,5,7,9,7,2,9,2,0,2,7,10],
[2,3,10,0,1,8,1,7,8,1,5,7],
[10,2,1,10,1,7,7,1,5],
[9,5,8,8,5,7,11,1,3,11,3,10],
[5,7,0,5,0,9,7,10,0,1,0,11,10,11,0],
[10,11,0,10,0,3,11,5,0,8,0,7,5,7,0],
[10,11,5,7,10,5],
[11,6,5],
[0,8,3,5,11,6],
[9,0,1,5,11,6],
[1,8,3,1,9,8,5,11,6],
[1,6,5,2,6,1],
[1,6,5,1,2,6,3,0,8],
[9,6,5,9,0,6,0,2,6],
[5,9,8,5,8,2,5,2,6,3,2,8],
[2,3,10,11,6,5],
[10,0,8,10,2,0,11,6,5],
[0,1,9,2,3,10,5,11,6],
[5,11,6,1,9,2,9,10,2,9,8,10],
[6,3,10,6,5,3,5,1,3],
[0,8,10,0,10,5,0,5,1,5,10,6],
[3,10,6,0,3,6,0,6,5,0,5,9],
[6,5,9,6,9,10,10,9,8],
[5,11,6,4,7,8],
[4,3,0,4,7,3,6,5,11],
[1,9,0,5,11,6,8,4,7],
[11,6,5,1,9,7,1,7,3,7,9,4],
[6,1,2,6,5,1,4,7,8],
[1,2,5,5,2,6,3,0,4,3,4,7],
[8,4,7,9,0,5,0,6,5,0,2,6],
[7,3,9,7,9,4,3,2,9,5,9,6,2,6,9],
[3,10,2,7,8,4,11,6,5],
[5,11,6,4,7,2,4,2,0,2,7,10],
[0,1,9,4,7,8,2,3,10,5,11,6],
[9,2,1,9,10,2,9,4,10,7,10,4,5,11,6],
[8,4,7,3,10,5,3,5,1,5,10,6],
[5,1,10,5,10,6,1,0,10,7,10,4,0,4,10],
[0,5,9,0,6,5,0,3,6,10,6,3,8,4,7],
[6,5,9,6,9,10,4,7,9,7,10,9],
[11,4,9,6,4,11],
[4,11,6,4,9,11,0,8,3],
[11,0,1,11,6,0,6,4,0],
[8,3,1,8,1,6,8,6,4,6,1,11],
[1,4,9,1,2,4,2,6,4],
[3,0,8,1,2,9,2,4,9,2,6,4],
[0,2,4,4,2,6],
[8,3,2,8,2,4,4,2,6],
[11,4,9,11,6,4,10,2,3],
[0,8,2,2,8,10,4,9,11,4,11,6],
[3,10,2,0,1,6,0,6,4,6,1,11],
[6,4,1,6,1,11,4,8,1,2,1,10,8,10,1],
[9,6,4,9,3,6,9,1,3,10,6,3],
[8,10,1,8,1,0,10,6,1,9,1,4,6,4,1],
[3,10,6,3,6,0,0,6,4],
[6,4,8,10,6,8],
[7,11,6,7,8,11,8,9,11],
[0,7,3,0,11,7,0,9,11,6,7,11],
[11,6,7,1,11,7,1,7,8,1,8,0],
[11,6,7,11,7,1,1,7,3],
[1,2,6,1,6,8,1,8,9,8,6,7],
[2,6,9,2,9,1,6,7,9,0,9,3,7,3,9],
[7,8,0,7,0,6,6,0,2],
[7,3,2,6,7,2],
[2,3,10,11,6,8,11,8,9,8,6,7],
[2,0,7,2,7,10,0,9,7,6,7,11,9,11,7],
[1,8,0,1,7,8,1,11,7,6,7,11,2,3,10],
[10,2,1,10,1,7,11,6,1,6,7,1],
[8,9,6,8,6,7,9,1,6,10,6,3,1,3,6],
[0,9,1,10,6,7],
[7,8,0,7,0,6,3,10,0,10,6,0],
[7,10,6],
[7,6,10],
[3,0,8,10,7,6],
[0,1,9,10,7,6],
[8,1,9,8,3,1,10,7,6],
[11,1,2,6,10,7],
[1,2,11,3,0,8,6,10,7],
[2,9,0,2,11,9,6,10,7],
[6,10,7,2,11,3,11,8,3,11,9,8],
[7,2,3,6,2,7],
[7,0,8,7,6,0,6,2,0],
[2,7,6,2,3,7,0,1,9],
[1,6,2,1,8,6,1,9,8,8,7,6],
[11,7,6,11,1,7,1,3,7],
[11,7,6,1,7,11,1,8,7,1,0,8],
[0,3,7,0,7,11,0,11,9,6,11,7],
[7,6,11,7,11,8,8,11,9],
[6,8,4,10,8,6],
[3,6,10,3,0,6,0,4,6],
[8,6,10,8,4,6,9,0,1],
[9,4,6,9,6,3,9,3,1,10,3,6],
[6,8,4,6,10,8,2,11,1],
[1,2,11,3,0,10,0,6,10,0,4,6],
[4,10,8,4,6,10,0,2,9,2,11,9],
[11,9,3,11,3,2,9,4,3,10,3,6,4,6,3],
[8,2,3,8,4,2,4,6,2],
[0,4,2,4,6,2],
[1,9,0,2,3,4,2,4,6,4,3,8],
[1,9,4,1,4,2,2,4,6],
[8,1,3,8,6,1,8,4,6,6,11,1],
[11,1,0,11,0,6,6,0,4],
[4,6,3,4,3,8,6,11,3,0,3,9,11,9,3],
[11,9,4,6,11,4],
[4,9,5,7,6,10],
[0,8,3,4,9,5,10,7,6],
[5,0,1,5,4,0,7,6,10],
[10,7,6,8,3,4,3,5,4,3,1,5],
[9,5,4,11,1,2,7,6,10],
[6,10,7,1,2,11,0,8,3,4,9,5],
[7,6,10,5,4,11,4,2,11,4,0,2],
[3,4,8,3,5,4,3,2,5,11,5,2,10,7,6],
[7,2,3,7,6,2,5,4,9],
[9,5,4,0,8,6,0,6,2,6,8,7],
[3,6,2,3,7,6,1,5,0,5,4,0],
[6,2,8,6,8,7,2,1,8,4,8,5,1,5,8],
[9,5,4,11,1,6,1,7,6,1,3,7],
[1,6,11,1,7,6,1,0,7,8,7,0,9,5,4],
[4,0,11,4,11,5,0,3,11,6,11,7,3,7,11],
[7,6,11,7,11,8,5,4,11,4,8,11],
[6,9,5,6,10,9,10,8,9],
[3,6,10,0,6,3,0,5,6,0,9,5],
[0,10,8,0,5,10,0,1,5,5,6,10],
[6,10,3,6,3,5,5,3,1],
[1,2,11,9,5,10,9,10,8,10,5,6],
[0,10,3,0,6,10,0,9,6,5,6,9,1,2,11],
[10,8,5,10,5,6,8,0,5,11,5,2,0,2,5],
[6,10,3,6,3,5,2,11,3,11,5,3],
[5,8,9,5,2,8,5,6,2,3,8,2],
[9,5,6,9,6,0,0,6,2],
[1,5,8,1,8,0,5,6,8,3,8,2,6,2,8],
[1,5,6,2,1,6],
[1,3,6,1,6,11,3,8,6,5,6,9,8,9,6],
[11,1,0,11,0,6,9,5,0,5,6,0],
[0,3,8,5,6,11],
[11,5,6],
[10,5,11,7,5,10],
[10,5,11,10,7,5,8,3,0],
[5,10,7,5,11,10,1,9,0],
[11,7,5,11,10,7,9,8,1,8,3,1],
[10,1,2,10,7,1,7,5,1],
[0,8,3,1,2,7,1,7,5,7,2,10],
[9,7,5,9,2,7,9,0,2,2,10,7],
[7,5,2,7,2,10,5,9,2,3,2,8,9,8,2],
[2,5,11,2,3,5,3,7,5],
[8,2,0,8,5,2,8,7,5,11,2,5],
[9,0,1,5,11,3,5,3,7,3,11,2],
[9,8,2,9,2,1,8,7,2,11,2,5,7,5,2],
[1,3,5,3,7,5],
[0,8,7,0,7,1,1,7,5],
[9,0,3,9,3,5,5,3,7],
[9,8,7,5,9,7],
[5,8,4,5,11,8,11,10,8],
[5,0,4,5,10,0,5,11,10,10,3,0],
[0,1,9,8,4,11,8,11,10,11,4,5],
[11,10,4,11,4,5,10,3,4,9,4,1,3,1,4],
[2,5,1,2,8,5,2,10,8,4,5,8],
[0,4,10,0,10,3,4,5,10,2,10,1,5,1,10],
[0,2,5,0,5,9,2,10,5,4,5,8,10,8,5],
[9,4,5,2,10,3],
[2,5,11,3,5,2,3,4,5,3,8,4],
[5,11,2,5,2,4,4,2,0],
[3,11,2,3,5,11,3,8,5,4,5,8,0,1,9],
[5,11,2,5,2,4,1,9,2,9,4,2],
[8,4,5,8,5,3,3,5,1],
[0,4,5,1,0,5],
[8,4,5,8,5,3,9,0,5,0,3,5],
[9,4,5],
[4,10,7,4,9,10,9,11,10],
[0,8,3,4,9,7,9,10,7,9,11,10],
[1,11,10,1,10,4,1,4,0,7,4,10],
[3,1,4,3,4,8,1,11,4,7,4,10,11,10,4],
[4,10,7,9,10,4,9,2,10,9,1,2],
[9,7,4,9,10,7,9,1,10,2,10,1,0,8,3],
[10,7,4,10,4,2,2,4,0],
[10,7,4,10,4,2,8,3,4,3,2,4],
[2,9,11,2,7,9,2,3,7,7,4,9],
[9,11,7,9,7,4,11,2,7,8,7,0,2,0,7],
[3,7,11,3,11,2,7,4,11,1,11,0,4,0,11],
[1,11,2,8,7,4],
[4,9,1,4,1,7,7,1,3],
[4,9,1,4,1,7,0,8,1,8,7,1],
[4,0,3,7,4,3],
[4,8,7],
[9,11,8,11,10,8],
[3,0,9,3,9,10,10,9,11],
[0,1,11,0,11,8,8,11,10],
[3,1,11,10,3,11],
[1,2,10,1,10,9,9,10,8],
[3,0,9,3,9,10,1,2,9,2,10,9],
[0,2,10,8,0,10],
[3,2,10],
[2,3,8,2,8,11,11,8,9],
[9,11,2,0,9,2],
[2,3,8,2,8,11,0,1,8,1,11,8],
[1,11,2],
[1,3,8,9,1,8],
[0,9,1],
[0,3,8],
[]
];

// C L A S S
// requires ImageJ 1.49k and later + java sun/oracle
// Uncomment the two following lines
// load('marchingCubes_Cube.js');
// load('marchingCubes_Slice.js');
//
// Otherwise, 
// (1) copy and paste the code contained in file 'marchingCube_Cube.js' 
// (2) copy and paste the code contained in file  marchingCube_Slice.js'


// M A I N

// Default Marching Cubes Parameters
var threshold=128;
var SIZE=2;
var mode=0; // No interpolation
var interpolate = null;

var mesh = {};
mesh.vertices = [];
mesh.faces = [];


// Dialog window to set parameters
dialog();

// Get input stack/volume information and initialize slice of cubes
var imp=IJ.getImage();
var stack=imp.getImageStack();
var nx=imp.getWidth();
var ny=imp.getHeight();
var nz=imp.getStackSize();
var center = {'x':(nx-1)/2.0, 'y':(ny-1)/2.0,'z':(nz-1)/2.0};

var slice= new Slice(Math.floor( (nx -1)/SIZE ),Math.floor( (ny-1)/SIZE ) );

// M a i n   L o o p

IJ.log("\\Clear");
IJ.log("Start of the main loop... Please wait.");
for (var z=0; z < nz-SIZE; z+=SIZE) {
  slice.reset_count();
  for (var y=0; y < ny-SIZE; y+=SIZE) {
    for (var x=0; x < nx-SIZE; x+=SIZE) {
      // 1- Create a new marching cube
      var cube = new Cube(x,y,z,SIZE);
      // 2- Set voxels in the cube
      cube.setVoxels(stack);
      // 3- Calc configuration
      cube.calcKey(threshold);
      // 4- Create vertices and triangles
      if (cube.key != 0 && cube.key != 255) {
        createTriangles(cube);
      }
      // 5- Update slice
      slice.push(cube);
    }
  }
  if ( (z%10) == 0) IJ.log("z="+z);
}
saveAsOBJ();
throw("-- End of Script --");


// F U N C T I O N S

function dialog() {
  var gd = new GenericDialog("Marching Cubes");
  gd.addNumericField("Threshold: ", threshold, 0);
  gd.addNumericField("Cube Size: ", SIZE, 0);
  gd.addChoice("Interpolation: ", ["None","Bilinear"], 0);
  gd.showDialog();
  if (gd.wasCanceled()) {
    return;
  }
  threshold = gd.getNextNumber();
  SIZE = gd.getNextNumber();
  mode = gd.getNextChoiceIndex();

  if (mode ==0) {
    interpolate = function (v0,v1) {
      return interpolateNone(v0,v1);
    }
  }
  else {
    interpolate = function (v0,v1) {
      return interpolateBilinear(v0,v1);
    }
  }

  var saveDialog = new SaveDialog("Save OBJ File As ...","Untitled",".obj");
  filename=saveDialog.getDirectory()+saveDialog.getFileName();

  IJ.log(filename);

}


function createTriangles(probe) {
  //IJ.log("key "+probe.key+" "+ probe.x +" "+probe.y+" "+probe.z);
  var vertices=[];
  var vertex = null;
  var edges=triangles[probe.key];
  for (var i=0;i<edges.length;i++) {
    var index=-1;
    var edge = edges[i];
    //IJ.log("edge "+edge);
    if (probe.edges[edge] != -1) {
      // Edge already calculated
      index = probe.edges[edge];
    }
    else {
      switch (edge) {
      case 0:
        if (probe.y != 0) {
          probe.edges[edge] = slice.above().edges[2];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(0),probe.getVertex(1) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        }
        break;
      case 1:
        if (probe.z != 0) {
          probe.edges[edge] = slice.back().edges[5];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(1),probe.getVertex(2) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        } 
        break;
      case 2:
        if (probe.z != 0) {
          probe.edges[edge] = slice.back().edges[6];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(2),probe.getVertex(3) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        } 
        break;
      case 3:
        if (probe.x != 0) {
          probe.edges[edge] = slice.previous().edges[1];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(0),probe.getVertex(3) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        } 
        break;
      case 4:
        if (probe.y != 0) {
          probe.edges[edge] = slice.above().edges[6];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(4),probe.getVertex(5) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        }
        break;
      case 5:
        vertex=interpolate(probe.getVertex(5),probe.getVertex(6) );
        mesh.vertices.push(vertex);
        index = mesh.vertices.length-1;
        probe.edges[edge]= index;
        break;
      case 6:
        vertex=interpolate(probe.getVertex(6),probe.getVertex(7) );
        mesh.vertices.push(vertex);
        index = mesh.vertices.length-1;
        probe.edges[edge]= index; 
        break;
      case 7:
        if (probe.x != 0) {
          probe.edges[edge] = slice.previous().edges[5];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(4),probe.getVertex(7) );
          mesh.vertices.push(vertex); 
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        } 
        break;
      case 8:
        if (probe.x != 0) {
          probe.edges[edge] = slice.previous().edges[9];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(0),probe.getvertex(4) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index;
        }
        break;
      case 9:
        if (probe.y != 0) {
          probe.edges[edge] = slice.above().edges[11];
          index = probe.edges[edge];
        }
        else {
          vertex=interpolate(probe.getVertex(1),probe.getVertex(5) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index; 
        }
        break;
      case 10:
        if (probe.x != 0) {
          probe.edges[edge] = slice.previous().edges[11];
          index = probe.edges[edge];
        }
        else {
          vertex = interpolate(probe.getVertex(3),probe.getVertex(7) );
          mesh.vertices.push(vertex);
          index = mesh.vertices.length-1;
          probe.edges[edge]= index; 
        }
        break;
      case 11:
        vertex=interpolate(probe.getVertex(2),probe.getVertex(6) );
        mesh.vertices.push(vertex);
        index = mesh.vertices.length-1;
        probe.edges[edge]= index; 
        break;
      }
    //IJ.log ("faces["+(mesh.faces.length-1)+"]= "+index);
    }
    mesh.faces.push(index);
  }
}

function saveAsOBJ() {
  IJ.log("Preparing file ...");
  var text='';
  // Header
  text+="# Marching Cubes\n";
  text+="# Jean-Christophe Taveau\n";
  text+="# CrazyBioComputing\n";
  text+="# WaveFront OBJ File Format\n";
  text+="# Vertices: "+mesh.vertices.length+"\n";
  text+="\n";
  text+="o "+imp.getTitle()+"\n";
  text+="\n";

  // Write output text in file
  var file = new java.io.File(filename);
  var  printWriter = new java.io.PrintWriter (filename);

  IJ.log("Writing header...");
  printWriter.println (text);

  // Vertices
  for (var i=0;i<mesh.vertices.length;i++) {
    printWriter.println ("v "+ (mesh.vertices[i].x - center.x)+" "+ (mesh.vertices[i].y - center.y) + " " + (mesh.vertices[i].z - center.z) );
  }
  IJ.log("Writing vertices...");
  printWriter.println (" ");

  // Faces (aka lines)
  // *Note*: The first vertex in OBJ format has the index 1 (and not 0).
  for (var i=0;i<mesh.faces.length;i+=3) 
    printWriter.println ("f "+(mesh.faces[i]+1) +" "+ (mesh.faces[i+1]+1) +" "+ (mesh.faces[i+2]+1) );

  IJ.log("Writing faces...");

  // Close file
  printWriter.close ();   
}

function interpolateNone(v0,v1) {
  var x = ( v0.x + v1.x )/2.0;
  var y = ( v0.y + v1.y )/2.0;
  var z = ( v0.z + v1.z )/2.0;
  return {"x":x,"y":y,"z":z};

}

function interpolateBilinear(v0,v1) {
  var k = (threshold - v0.voxel)/(v1.voxel - v0.voxel);
  var x = v0.x + (v1.x - v0.x) * k;
  var y = v0.y + (v1.y - v0.y) * k;
  var z = v0.z + (v1.z - v0.z) * k;
  return {"x":x,"y":y,"z":z};
}




function interpolateBilinearv0,v1) {
  var k = (threshold - v0)/(v1 - v0);
  var x = x0 + (x1 - x0) * k;
  var y = y0 + (y1 - y0) * k;
  var z = z0 + (z1 - z0) * k;
  return {"x":x,"y":y,"z":z};
}

