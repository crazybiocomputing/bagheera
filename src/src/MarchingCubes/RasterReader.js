var RasterReader = function () {

}

RasterReader.prototype.getFromDOM = function(document_id,format) {
  var image = document.getElementById(document_id).innerHTML;  
  var mol = this.createStructure(image,format);
  return mol;
}
/*
RasterReader.prototype.getFromURL = function(url) {
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

RasterReader.prototype.getFromID = function(pdb_id) {
  return this.getFromURL("http://www.rcsb.org/pdb/files/"+pdb_id+".pdb");

}
*/
RasterReader.prototype.createStructure = function(image,format) {

  // 1- Choose the good parser
  var parser = null;

  if (format === 'tif' || format === 'tiff') {
    parser = new TIFFParser();
  }
  else if (format === 'spider') {
    parser = new readSpiderFile();
  }
  else if (format === 'mrc') {
    //parser = new PDBMLParser();
  }
  else {
    alert("Le format est incorrect. Entrez un tif, mrc ou spider.")
  }
  
  // 2- Parse the file
  //parser.parse(image); 
  //var mol = parser.getStructure(); 
  return;
  //return mol;
}
