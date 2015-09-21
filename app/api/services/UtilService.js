module.exports = {
  getKeyValueObjArrInArr : function(arr , key , val){
    var filteredArr = arr.filter(function (entry) {
      return entry[key] === val;
    });
    return filteredArr;
  } ,
  isKeyValueObjInArr : function (arr, key, val) {
    return this.getKeyValueObjArrInArr(arr , key , val ).length > 0;
  }
};
