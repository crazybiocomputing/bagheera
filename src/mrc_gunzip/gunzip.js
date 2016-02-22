"use strict" ;

/*
*@param {String, Array, Binary}content from file
*/ 
function zip(content2){
	var binData     = new Uint8Array(content2);
	 return pako.gzip(binData);
}

/*
*@param {String, Array, Binary} content from file
*/ 
function unzip(content1){
 binData=pako.ungzip(content1);
var strData = String.fromCharCode.apply(null, new Uint16Array(binData));
return strData;
}
/*
* @param {Blob} file File to read from uploaded by user
* 
*/
function readFile(file) {
	try {
		var reader = new FileReader();

		reader.onload = function(e) {
			var contents = e.target.result;


			if (file.type=="application/gzip"){
				var unzipped=unzip(contents);
				console.log(unzipped);
			}
			else{
				var zipped=zip(contents);
				console.log(zip(contents));

			}
			
		};

		reader.readAsArrayBuffer(file);
	} catch(e) {
		alert("Impossible de lire le fichier.") ;
	}
}