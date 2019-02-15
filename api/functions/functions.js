var functions = {
  isUndefined : (param_array) =>{
    let result = false;
    for(var i=0; i<param_array.length; i++){
      if(param_array[i] === undefined){
        result = true;
        break;
      }
    }
    return result;
  }
};

module.exports = functions;