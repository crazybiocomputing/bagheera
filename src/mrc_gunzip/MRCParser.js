const sizeWord = 4 ;
const defaultHeaderSize = 256 ;

"use strict" ;

/**
 * @param {Blob} file File to read from.
 * @param {function} callback The function to execute after reading the file, it take two parameters :
 *		- imagePix : the pixels of the image(s), it is a 2d array if the type is 'image', if the type is 'stack' it is a 3d array.
 * @param {} endianness Define the endianness, big endian if the value is undefined or flase, little indian otherwise.
 */
function readMRCFile(file, callback, endianness) {
	try {
		var reader = new FileReader();

		reader.onload = function(e) {
			var contents = e.target.result;
			var tabImage3D = getContents(contents, endianness) ;
			callback(tabImage3D)
			
			return(tabImage3D)
		};

		reader.readAsArrayBuffer(file);
	} catch(e) {
		alert("Impossible de lire le fichier.") ;
	}
	

}

/**
 * @param {File} Contents a MRC file content to extract the pixels from.
 * @param {} endianness Define the endianness, big endian if the value is undefined or flase, little indian otherwise.
 * @return The pixels of the image(s).
 */
function getContents(contents, endianness) {
	try {
		var data = new DataView(contents)
        nX = data.getInt32(0 * sizeWord, endianness); // number of columns
        nY = data.getInt32(1 * sizeWord, endianness); // number of rows
        nZ = data.getInt32(2 * sizeWord, endianness); // number of images
        type = data.getInt32(3 * sizeWord, endianness); // Type of images
            
        var pos = 256 ; // Position after header
        if (type === 1){
            var tabImage3D = new Array(nZ);
            for(var k = 0 ; k < nZ ; k++) {
			    tabImage3D[k] = new Array(nY); // rows
			    for(var i = 0 ; i < nY ; i++) {
				    tabImage3D[k][i] = new Array(nX); // columns
					for(var j = 0 ; j < nX ; j++) {
				    	tabImage3D[k][i][j] = data.getFloat16(pos * 4, endianness);
					    pos++ ;
		    		}
		        }
	        }
        } else if (type === 2){
            var tabImage3D = new Array(nZ);
            for(var k = 0 ; k < nZ ; k++) {
				tabImage3D[k] = new Array(nY) ;
			    for(var i = 0 ; i < nY ; i++) {
				    tabImage3D[k][i] = new Array(nX) ;
				    for(var j = 0 ; j < nX ; j++) {
				    	tabImage3D[k][i][j] = data.getFloat32(pos * 4, endianness) ;
						pos++ ;
			        }
			    }
		    }
		}
		return  tabImage3D ;
	}catch(e) {
		alert("Impossible d'ouvrir le fichier.") ;
		console.error(e.message) ;
	}
}

/**
 * @param {Array[Array]} imagePix A 2d array containing the pixels of an image.
 * @param {Canvas} canvas The canvas to put the image in.
 */			
function displayImage(tabImage2D, canvas) {
	var nligne = tabImage2D.length ;
	var ncolonne = tabImage2D[0].length ;

	canvas.width = ncolonne;
	canvas.height = nligne;

	var ctx = canvas.getContext('2d');

	for(var i = 0 ; i < nligne ; i++) {
		for (var j = 0; j < ncolonne; j++ ){
			var pixel = Math.round(tabImage2D[i][j]*255);
			if (pixel < 16){
				hexString = "0" + pixel.toString(16);
			}
			else {
				hexString = pixel.toString(16);
			}
			var hexadec = "#"+hexString+hexString+hexString ;
					  	
			ctx.fillStyle = hexadec;
			ctx.fillRect(i,j,1,1);
		}
	}
}