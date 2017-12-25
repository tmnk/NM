var _method = 0;
var _app = 0;
window.addEventListener('load', function () {
  var method = document.querySelector('.method');
  var explict = document.querySelector('.explict');
  var implict = document.querySelector('.implict');

  var twoFirst = document.querySelector('#twoFirst');
  var threeSecond = document.querySelector('#threeSecond');
  var twoSecond = document.querySelector('#twoSecond');
  var boundCond = 0;
  var tau = document.querySelector('.tau');
  var eps = document.querySelector('.eps');
  var change = false;
  eps.addEventListener('change', () => {
    h = eps.value;
    solve(_method, boundCond, _app);
    Change();
  });
  tau.addEventListener('change', () => {
    m_tau = tau.value;
    solve(_method, boundCond, _app);
    Change();
  });
  twoFirst.addEventListener('change', function () {
    boundCond = 0;
    solve(_method, boundCond, _app);
    Change();
  });
  threeSecond.addEventListener('change', function () {
    boundCond = 1;
    solve(_method, boundCond, _app);
    Change();
  });
  twoSecond.addEventListener('change', function () {
    boundCond = 2;
    solve(_method, boundCond, _app);
    Change();
  });
  method.addEventListener('click', function (event) {
    if (!event.target.classList.contains('met')) return;

    if (event.target === implict) {
      _method = 0;
      solve(_method, boundCond, _app);
      Change();
    }
    if (event.target === explict) {
      _method = 1;
      solve(_method, boundCond, _app);
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
  var k = 1;
  var _xd = [], _yd = [], _yr = [], _ex = [], _er = [];
  for (var j = 0; j < vecX.size() / 2; ++j) {
    _xd.push(vecX.get(j))
    _yr.push(u(vecX.get(j), vecT.get(k)));
    _yd.push(matU.get(k, j));
  }
  // for (var i = 0; i < matU.rowSize() / 20; ++i) {
  //   var error = 0.0;
  //   for (var j = 0; j < matU.colSize(); ++j) {
  //     error = Math.max(error, Math.abs(matU.get(i, j) - u(vecX.get(j), vecT.get(i))));
  //   }

  //   _ex.push(vecT.get(i));
  //   _er.push(error);
  // }
  Draw(_ex,_er,_xd,_yr,_yd);
}


// solve(1,3,1);
// var  k = 1;
// var _xd = [], _yd = [], _yr = [];
// for (var j = 0; j < vecX.size(); ++j) {
//   _xd.push(vecX.get(j))
//   _yr.push(u(vecX.get(j), vecT.get(k)));
//   _yd.push(matU.get(k, j));
// }
// Draw([],[],_xd,_yr,_yd);
});

