
R("root", "BaseModule", function(){
  this.onLoad = function(){
    var a = this.$promise((resolve) => {
      resolve(123)
    })
    .then((val) => {
      console.log(val)
      console.log(a)
      return 555
    })
    .then((val) => {
      console.log(val)
    })
    .then((val) => {
      console.log(val)
    })
  };
});
