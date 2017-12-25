function funcD(t, x) {
  return 0;
}
function phi0(t, x) { //
  return 0;
}
function phi1(t, x) {
  return 0;
}
function ux0(t, x) {
  return Math.sin(Math.PI * 2 * x);
}
function funcAnal(t, x) {
  return Math.exp(-4*Math.PI*Math.PI*1*t)*Math.sin(Math.PI * 2 * x);
}
//
FiniteDifference(leftX, rightX, leftT, rightT, dx);
setCoeff(a, b, c);
setBoundCondCoeff(alpha, beta, gamma, delta, boundCond);

window.addEventListener('load', function () {
  var method = document.querySelector('.method');
  var explict = document.querySelector('.explict');
  var implict = document.querySelector('.implict');
  var cn = document.querySelector('.cn');

  var twoFirst = document.querySelector('#twoFirst');
  var threeSecond = document.querySelector('#threeSecond');
  var twoSecond = document.querySelector('#twoSecond');
  var boundCond = 0;
  var tau = document.querySelector('.tau');
  var eps = document.querySelector('.eps');
  var change = false;
  eps.addEventListener('change', () => {
    dx = eps.value
    var event;
    change = true
    event = document.createEvent('Event');
    event.initEvent('click', true, false);
    method.dispatchEvent(event);
  });
  tau.addEventListener('change', () => {
    dt = tau.value
    var event;
    change = true
    event = document.createEvent('Event');
    event.initEvent('click', true, false);
    method.dispatchEvent(event);
  });
  twoFirst.addEventListener('change', function () {
    var event;
    change = true
    event = document.createEvent('Event');
    event.initEvent('click', true, false);
    method.dispatchEvent(event);
  });
  threeSecond.addEventListener('change', function () {
    var event;
    change = true
    event = document.createEvent('Event');
    event.initEvent('click', true, false);
    method.dispatchEvent(event);
  });
  twoSecond.addEventListener('change', function () {
    var event;
    change = true
    event = document.createEvent('Event');
    event.initEvent('click', true, false);
    method.dispatchEvent(event);
  });
  method.addEventListener('click', function (event) {
    var tmpBoundCond = boundCond;
    if (twoFirst.checked) {
        boundCond = 0;
    }
    else if (threeSecond.checked) {
        boundCond = 1;
    }
    else if (twoSecond.checked) {
        boundCond = 2;
    }
    if (!event.target.classList.contains('met') && tmpBoundCond === boundCond && !change) return;
    change = false
    function Change(data) {
      dx = eps.value
      dt = tau.value
      FiniteDifference(leftX, rightX, leftT, rightT, dx, dt);
      setCoeff(a, b, c);
      setBoundCondCoeff(alpha, beta, gamma, delta, boundCond);
      var k = 1.;
      var xData = [];
      var yData = [];
      var trueData = [];
      var errorData = [[],[]];
      xData = data[0]
      ansData = data[1];
      for (var i = 0; i < xData.size(); i++) {
        yData.push(data[1].get(i, k));
        trueData.push(funcAnal(leftT + k * dt, leftX + i * dx));
      }
      for (var i = 0; i < ansData.colSize(); i++) {
          var error = 0.0;
          for (var j = 0; j < ansData.rowSize(); j++) {
              error = Math.max(error, Math.abs(ansData.get(j, i) - funcAnal(leftT + i * dt, leftX + j * dx)));
          }
          errorData[0].push(leftT + i * dt);
          errorData[1].push(error);
      }
      console.log(xData.array, trueData, yData);
      Draw(errorData[0], errorData[1], xData.array, trueData, yData);
    }
    if (event.target === implict) {
      data = implicit()
      Change(data);
    }
    if (event.target === explict) {
      data = explicit()
      Change(data);
    }
    if (event.target === cn) {
      data = cnm(0.5)
      Change(data);
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
    "options":{}});
  }
});
