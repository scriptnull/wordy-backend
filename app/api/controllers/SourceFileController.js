/**
* SourceFileController
*
* @description :: Server-side logic for managing Sourcefiles
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var fs = require('fs');
module.exports = {

	parse : function(req , res ){
		//upload file first
		req.file('srcfile').upload(function(err , uploadedFiles){
			if(err) return res.negotiate(err);
			if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');

			var isTextFile = function(mimeType){
				return mimeType.toString() === 'text/plain'
			};

			var makeDBEntryForTxt = function(fd ,cb){
				if(isTextFile(fd.type)){
					SourceFile.create({
						fileDescriptor : fd
					}).exec(function(err,obj){
						(cb || ErrorService.noop )(err , obj );
					});
				}else{
					(cb || ErrorService.noop )(new Error('only plain text files are allowed'));
				}
			};

			var readFileContent = function(path , cb ){
				fs.readFile(path , { encoding : 'utf8'} , function(err , content){
					(cb || ErrorService.noop )(err , content );
				});
			};

			var parseContent = function(content , cb){
				var dataArr = content.split(' ').filter(function(val){
					return val != '';
				});
				var srcArr = [];
				for(var i = 0 ; i < dataArr.length -1 ; i++){
					var key = dataArr[i];
					if(!UtilService.isKeyValueObjInArr(UtilService.getKeyValueObjArrInArr(srcArr , 'key' , key ), 'token' , dataArr[i + 1])){
						srcArr.push({ key : dataArr[i] , token : dataArr[i+1] , count : 1 });
					}else{
						for(var j = 0  ; j < srcArr.length ; j++ ){
							if( srcArr[j].key === dataArr[i] && srcArr[j].token === dataArr[i+1] ){
								srcArr[j].count = srcArr[j].count + 1 ;
								break;
							}
						}
					}
				}
				(cb || ErrorService.noop )( null , srcArr );
			};

			makeDBEntryForTxt(uploadedFiles[0] , function(err , srcFileObj ){
				if(err) return res.json({error :  err.toString() });
				readFileContent(srcFileObj.fileDescriptor.fd , function(err , content){
					if(err) return res.json({error :  err.toString() });
					parseContent(content , function(err , srcArr){
						if(err) return res.json({error :  err.toString() });
						return res.json(srcArr);
					});
				});
			});

	});
} ,

example : function(req , res ){
	return res.view('example');
}

};
