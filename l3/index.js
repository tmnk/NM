var _method = 0;
var _app = 0;
window.addEventListener('load', function () {
  var method = document.querySelector('.method');
  var zeidel = document.querySelector('.zeidel');
  var libman = document.querySelector('.libman');
  var relax = document.querySelector('.relax');
  var tau = document.querySelector('.tau');
  var eps = document.querySelector('.eps');
  tau.max = 10;
  eps.max = 10;
  _x = tau.value
  _y = eps.value
  Change();
  eps.addEventListener('change', () => {
    h = eps.value;
    //solve(_method, boundCond, _app);
    Change();
  });
  tau.addEventListener('change', () => {
    m_tau = tau.value;
    //solve(_method, boundCond, _app);
    Change();
  });
 
  method.addEventListener('click', function (event) {
    if (!event.target.classList.contains('met')) return;

    if (event.target === relax) {
      _method = 2;
      //solve(_method, boundCond, _app);
      Change();
    }
    if (event.target === zeidel) {
      _method = 1;
      //solve(_method, boundCond, _app);
      Change();
    }
    if (event.target === libman) {
      _method = 0;
      //solve(_method, boundCond, _app);
      Change();
    }
  });
function Draw(epsX, epsY, realX, realY, myY) {
  var ctx = document.getElementById("Epsilon");
  new Chart(ctx, {
    "type":"line",
    "data":{
      "labels":epsX,
      "datasets":[{
        "label":"Epsilon",
        "data":epsY,
        "fill":false,
        "borderColor":"rgb(75, 192, 192)",
        "lineTension":0.1}]
    },
    "options":{}});
  var ctx = document.getElementById("Main");
  new Chart(ctx, {
    "type":"line",
    "data":{
      "labels":realX,
      "datasets":[{
        "label":"Real",
        "data":realY,
        "fill":false,
        "borderColor":"rgb(75, 192, 192)",
        "lineTension":0.1},
        {
          "label":"Aproximation",
          "data":myY,
          "fill":false,
          "borderColor":"rgb(175, 92, 192)",
          "lineTension":0.1}]
    },
    "options":{}});};
function Change() {
  [x,y,f,u,_er, _ey] = solver();
  var _u = [], _f = [], _er = [], _x = [];
  var t;
  if (_x != tau.value) {
    k = tau.value
    _x = k
    t = x[k]
  }  
  if (_y != eps.value) {
    k = eps.value
    _y = k
    t = y[k]
  }
  

  for (var i = 0; i < f.length; i++) {
    _f.push(f[k][i])
  }
  for (var i = 0; i < u.length; i++) {
    _u.push(u[k][i])
  }
  for (var i = 0; i < u.length; i++) {
    _er.push(Math.abs(_u[i] - _f[i]))
  }
  // alert(t.length)
  // for (var i = 0; i < t.length; i++) _x.push(Math.round(t[i] * 100 / 100))
  console.log(f, u)
  Draw(t,_er,t,_f,_u);
}


// //solve(1,3,1);
// var  k = 1;
// var _xd = [], _yd = [], _yr = [];
// for (var j = 0; j < vecX.size(); ++j) {
//   _xd.push(vecX.get(j))
//   _yr.push(u(vecX.get(j), vecT.get(k)));
//   _yd.push(matU.get(k, j));
// }
// Draw([],[],_xd,_yr,_yd);
});

