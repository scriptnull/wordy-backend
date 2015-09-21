/**
* Token.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    key : {
      type : 'string' ,
      required : true
    } ,

    token : {
      type : 'string' ,
      required : true
    } ,

    count : {
      type : 'string' ,
      required : true
    } ,

    sourceFile : {
     model : 'SourceFile' ,
     required : true 
    }

  }
};
