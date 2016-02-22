// Marching Cubes
// Jean-Christophe Taveau
// http://crazybiocomputing.blogspot.com
// Nov 2014
 
 
// class Slice 
function Slice(cubes_per_row, cubes_per_column) {
  this.cubes = [];
  this.count = 0;
  this.w = cubes_per_row;
  this.h = cubes_per_column;
}

Slice.prototype.reset_count = function () {
  this.count=0;
}

Slice.prototype.push = function (a_cube) {
  this.cubes[this.count++] = a_cube;
}

Slice.prototype.previous = function () {
  return this.cubes[this.count - 1];
}

Slice.prototype.above = function () {
  return this.cubes[this.count - this.w];
}

Slice.prototype.back = function () {
  return this.cubes[this.count];
}
