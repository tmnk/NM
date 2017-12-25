class Matrix {
  constructor(m, n) {
    this.n = parseInt(n);
    this.m = parseInt(m);
    var g = [];
    for (var i = 0; i < m; i++) {
      var tmp = [];
      for (var j = 0; j < n; j++) {
        tmp.push(0.0);
      }
      g.push(tmp);
    }
    this.array = g;
  }
  get(i, j) {
    if (i < this.m && j < this.n && i >= 0 && j >= 0) return this.array[i][j];
    return 0;
  }
  set(i, j, k) {
    if (i < this.m && j < this.n && i >= 0 && j >= 0) this.array[i][j] = k;
    else return 0;//
    return k;
  }
  swapRows(index1, index2) {
    var tmp = this.array[index1];
    this.array[index1] = this.array[index2];
    this.array[index2] = tmp;
  }
  copy(other) {
    for (var i = 0; i < other.rowSize(); ++i) {
      for (var j = 0; j < other.colSize(); ++j) {
        this.set(i, j, other.get(i, j));
      }
    }
  }
  colSize() {
    return this.n;
  }
  rowSize() {
    return this.m;
  }
  size() {
    return this.m;
  }
}

class Vector {
  constructor(n) {
    this.n = parseInt(n);
    var tmp = [];
    for (var i = 0; i < n; i++) {
      tmp.push(0);
    }
    this.array = tmp;
  }
  // Vector() {
  //   this.n = parseInt(3);
  //   this.array = [0,0,0];
  // }
  get(i) {
    if (i < this.n && i >= 0) return this.array[i]; //
    else return 0;
  }
  set(i, k) {
    if (i < this.n && i >= 0) this.array[i] = k;
    else return 0
    return k;
  }
  swap(index1, index2) {
    var tmp = this.get(index1);
    this.set(index1, this.get(index2));
    this.set(index2, tmp);
  }
  size() {
    return this.n;
  }
}

class Tridiagonal {
  constructor() {
    this.x = new Vector(3);
    this.sufficient_condition = false
  }
  solve(mat, vec) {
      var n = vec.size();
      this.sufficient_condition = true;

      for (var i = 0; i < n; i++) {
          if (Math.abs(mat.get(i, i - 1)) + Math.abs(mat.get(i, i + 1)) > Math.abs(mat.get(i, i)))
              this.sufficient_condition = false;
      }

      var p = new Vector(n);
      var q = new Vector(n);
      var pi, qi;

      this.x = new Vector(n);

      for (var i = 0; i < n; ++i) {
          var a = mat.get(i, i - 1);
          var b = mat.get(i, i);
          var c = mat.get(i, i + 1);
          if (!a) a = 0;
          if (!c) c = 0;
          pi = (-1) * c / (b + a * p.get(i - 1));
          qi = (vec.get(i) - a * q.get(i - 1)) / (b + a * p.get(i - 1));

          p.set(i, pi);
          q.set(i, qi);
      }

      for (var i = n - 1; i >= 0; --i) {
          this.x.set(i, p.get(i) * this.x.get(i + 1) + q.get(i));
      }
  }

  get_X() {
      return this.x;
  }

  get_sufficient_condition() {
      return this.sufficient_condition;
  }
}
