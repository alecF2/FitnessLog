function makeObj(f) {
  return {
    x: "cow",
    manipulate: function() {
      return f(this.x);
    }
  }
}

let y = makeObj(function(x) {
  return x + "s";
})

console.log(y.manipulate());