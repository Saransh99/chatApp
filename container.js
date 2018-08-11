// all the modules that we need often is loaded in this file 
// all the basic modules such as loadash, async , moment etc
// the modules that we only need once we dont need to set them up in this file
const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

// now we create the array of all the modules with their names
const simpleDependencies = [
    ['_','lodash']
];
// now to register the modules
// val[0] is the var name of the modules and the val[1] is the module itself

simpleDependencies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container',function(){
    return container;
});

module.exports = container;