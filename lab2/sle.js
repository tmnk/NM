var m_detSign = 0;
function m_lup(mat, matL, matU, vecP) {
		var n = mat.size();

		m_detSign = 1;
		matU.copy(mat);

		for (var i = 0; i < n; ++i) {
			vecP.set(i, i);
		}

		for (var j = 0; j < n; ++j) {
			var row = -1;
			var max = 0.0;

			for (var i = j; i < n; ++i) {
				var element = Math.abs(matU.get(i, j));

				if (element > max) {
					max = element;
					row = i;
				}
			}

			if (row == -1) {
				return false;
			}

			if (row != j) {
				m_detSign *= -1;
			}

			matU.swapRows(j, row);
			matL.swapRows(j, row);
			matL.set(j, j, 1);
			vecP.swap(j, row);

			for (var i = j + 1; i < n; ++i) {
				var ratio = matU.get(i, j) / matU.get(j, j);

				for (var k = j; k < n; ++k) {
					matU.set(i, k, matU.get(i, k) - matU.get(j, k) * ratio);
				}

				matL.set(i, j, ratio);
			}
		}

		return true;
	}

  function m_frontSub(mat, vec, vecP, vecX) {
		var n = mat.size();

		for (var i = 0; i < n; ++i) {
			var sum = 0.0;

			for (var j = 0; j < i; ++j) {
				sum += mat.get(i, j) * vecX.get(j);
			}

			vecX.set(i, vec.get(parseInt(vecP.get(i))) - sum);
		}
	}

	function m_backSub(mat, vec, vecX) {
		var n = mat.size();

		for (var i = n - 1; i >= 0; --i) {
			var sum = 0.0;

			for (var j = i + 1; j < n; ++j) {
				sum += mat.get(i, j) * vecX.get(j);
			}

			vecX.set(i, (vec.get(i) - sum) / mat.get(i, i));
		}
	}

  function lup(mat, vec, vecX) {
		var n = mat.size();
		var matL = new Matrix(n, n);
		var matU = new Matrix(n, n);
		var vecP = new Vector(n);
		var vecY = new Vector(n);

		if (!m_lup(mat, matL, matU, vecP)) {
			return false;
		}

		m_frontSub(matL, vec, vecP, vecY);
		m_backSub(matU, vecY, vecX);

		return true;
	}


function tma(mat, vec, vecRes) {
    var n = vec.size();
    var p = new Vector(n);
    var q = new Vector(n);
    var pi, qi;

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
        vecRes.set(i, p.get(i) * vecRes.get(i + 1) + q.get(i));
    }
}
