var m_e = 2;
var m_a = 1;
var m_b = 2;
var m_c = -3;
var m_f = function (x, t) { return 0;};
var m_psi1 = function (x) {return Math.exp(-x)*Math.cos(x);};
var m_psi1Deriv1 = function (x) {return -Math.exp(-x)*(Math.cos(x) + Math.sin(x));};
var m_psi1Deriv2 = function (x) {return 2 * Math.exp(-x)*Math.sin(x);};
var m_psi2 = function (x) {return Math.exp(-x)*Math.cos(x);};
var m_alpha = 0;
var m_beta = 1;
var m_gamma = 0;
var m_delta = 1;
var m_fi0 = function (t) {return Math.exp(-t) * Math.cos(2 * t);};
var m_fi1 = function (t) { return 0;};
var m_l = 1.570796;
var m_k = 1000;
var m_n = 100;
var u = function (x, t) {return Math.exp(-t - x) * Math.cos(x) * Math.cos(2 * t);};

var m_tau = 0.001;
var h = m_l / m_n;

var SCHEME_EXPLICIT = 0;
var SCHEME_IMPLICIT = 1;

var BOUNDARY_CONDITION_2_1 = 0;
var BOUNDARY_CONDITION_3_2 = 1;
var BOUNDARY_CONDITION_2_2 = 2;

var INITIAL_CONDITION_1 = 0;
var INITIAL_CONDITION_2 = 1;

var matU, vecX, vecT;


function solve(schemeType, boundCondType, initCondType) {
	matU = new Matrix(m_k + 1, m_n + 1);
	vecX = new Vector(m_n + 1);
	vecT = new Vector(m_k + 1);

	for (var j = 0; j <= m_n; ++j) {
		vecX.set(j, j * h);
		matU.set(0, j, m_psi1(vecX.get(j)));
	}

	for (var i = 0; i <= m_k; ++i) {
		vecT.set(i, i * m_tau);
	}

	switch (initCondType) {
		case INITIAL_CONDITION_1:
			for (var j = 0; j <= m_n; ++j) {
				matU.set(1, j, matU.get(0, j) + m_psi2(vecX.get(j)) * m_tau);
			}

			break;

		case INITIAL_CONDITION_2:
			for (var j = 0; j <= m_n; ++j) {
				var x = vecX.get(j);
				var res = 0.0;

				res += m_a * m_a * m_psi1Deriv2(x) + m_b * m_psi1Deriv1(x) + m_c * matU.get(0, j) + m_f(x, vecT.get(1));
				res *= m_tau * m_tau / 2.0;
				res += m_psi2(x) * m_tau;
				res += matU.get(0, j);

				matU.set(1, j, res);
			}

			break;
	}
	for (var i = 1; i < m_k; ++i) {
		var tNext = vecT.get(i + 1);
		var fi0 = m_fi0(tNext);
		var fi1 = m_fi1(tNext);

		switch (schemeType) {
			case SCHEME_EXPLICIT: {

				for (var j = 1; j < m_n; ++j) {
					var res = 0.0;

					res += m_a * m_a * (matU.get(i, j + 1) - 2.0 * matU.get(i, j) + matU.get(i, j - 1)) / (h * h);
					res += m_b * (matU.get(i, j + 1) - matU.get(i, j - 1)) / (2.0 * h);
					res += m_c * matU.get(i, j) + m_f(vecX.get(j), vecT.get(i));
					res *= 2.0 * m_tau * m_tau;
					res -= 2.0 * (matU.get(i - 1, j) - 2.0 * matU.get(i, j));
					res += m_e * m_tau * matU.get(i - 1, j);
					res /= 2.0 + m_e * m_tau;

					matU.set(i + 1, j, res);
				}
				var bound1 = 0.0;
				var bound2 = 0.0;

				switch (boundCondType) {
					case BOUNDARY_CONDITION_2_1:
						bound1 = (h * fi0 - m_alpha * matU.get(i + 1, 1)) / (h * m_beta - m_alpha);
						bound2 = (h * fi1 + m_gamma * matU.get(i + 1, m_n - 1)) / (h * m_delta + m_gamma);

						break;

					case BOUNDARY_CONDITION_3_2:
						bound1 = 2.0 * h * fi0 - m_alpha * (4.0 * matU.get(i + 1, 1) - matU.get(i + 1, 2));
						bound1 /= 2.0 * h * m_beta - 3.0 * m_alpha;
						bound2 = 2.0 * h * fi1 - m_gamma * (matU.get(i + 1, m_n - 2) - 4.0 * matU.get(i + 1, m_n - 1));
						bound2 /= 2.0 * h * m_delta + 3.0 * m_gamma;

						break;

					case BOUNDARY_CONDITION_2_2:
						if (m_alpha == 0.0) {
							bound1 = fi0 / m_beta;
						} else {
							var b0 = 2.0 * m_a * m_a / h + h / m_tau - m_c * h - (m_beta / m_alpha) * (2.0 * m_a * m_a - m_b * h);
							var c0 = -2.0 * m_a * m_a / h;
							var d0 = (h / m_tau) * matU.get(i, 0) - fi0 * (2.0 * m_a * m_a - m_b * h) / m_alpha;

							bound1 = (d0 - c0 * matU.get(i + 1, 1)) / b0;
						}

						if (m_gamma == 0.0) {
							bound2 = fi1 / m_delta;
						} else {
							var an = -2.0 * m_a * m_a / h;
							var bn = 2.0 * m_a * m_a / h + h / m_tau - m_c * h + (m_delta / m_gamma) * (2.0 * m_a * m_a + m_b * h);
							var dn = (h / m_tau) * matU.get(i, m_n) + fi1 * (2.0 * m_a * m_a + m_b * h) / m_gamma;

							bound2 = (dn - an * matU.get(i + 1, m_n - 1)) / bn;
						}

						break;
				}

				matU.set(i + 1, 0, bound1);
				matU.set(i + 1, m_n, bound2);

				break;
			}

			case SCHEME_IMPLICIT: {
				var mat = new Matrix(m_n + 1, m_n + 1);
				var vec = new Vector(m_n + 1);
				var vecRes = new Vector(m_n + 1);
				var sigma1 = m_tau * m_tau * m_a * m_a / (h * h);
				var sigma2 = m_tau * m_tau * m_c - 1.0 - m_e * m_tau / 2.0;
				var sigma3 = m_tau * m_tau * m_b / (2.0 * h);
				var coefA = sigma1 - sigma3;
				var coefB = sigma2 - 2.0 * sigma1;
				var coefC = sigma1 + sigma3;

				for (var row = 1; row < m_n; ++row) {
					var res = 0.0;

					res += (1.0 - m_e * m_tau / 2.0) * matU.get(i - 1, row);
					res -= 2.0 * matU.get(i, row);
					res -= m_tau * m_tau * m_f(vecX.get(row), tNext);

					mat.set(row, row - 1, coefA);
					mat.set(row, row, coefB);
					mat.set(row, row + 1, coefC);
					vec.set(row, res);
				}

				switch (boundCondType) {
					case BOUNDARY_CONDITION_2_1:
						mat.set(0, 0, m_beta - m_alpha / h);
						mat.set(0, 1, m_alpha / h);
						mat.set(m_n, m_n - 1, -m_gamma / h);
						mat.set(m_n, m_n, m_delta + m_gamma / h);
						vec.set(0, fi0);
						vec.set(m_n, fi1);

						tma(mat, vec, vecRes);

						break;

					case BOUNDARY_CONDITION_3_2:
						var h2 = 2.0 * h;

						mat.set(0, 0, m_beta - 3.0 * m_alpha / h2);
						mat.set(0, 1, 4.0 * m_alpha / h2);
						mat.set(0, 2, -m_alpha / h2);
						mat.set(m_n, m_n - 2, m_gamma / h2);
						mat.set(m_n, m_n - 1, -4.0 * m_gamma / h2);
						mat.set(m_n, m_n, m_delta + 3.0 * m_gamma / h2);
						vec.set(0, fi0);
						vec.set(m_n, fi1);

						lup(mat, vec, vecRes);

						break;

					case BOUNDARY_CONDITION_2_2:
						if (m_alpha == 0.0) {
							mat.set(0, 0, m_beta);
							vec.set(0, fi0);
						} else {
							var b0 = 2.0 * m_a * m_a / h + h / m_tau - m_c * h - (m_beta / m_alpha) * (2.0 * m_a * m_a - m_b * h);
							var c0 = -2.0 * m_a * m_a / h;
							var d0 = (h / m_tau) * matU.get(i, 0) - fi0 * (2.0 * m_a * m_a - m_b * h) / m_alpha;

							mat.set(0, 0, b0);
							mat.set(0, 1, c0);
							vec.set(0, d0);
						}

						if (m_gamma == 0.0) {
							mat.set(m_n, m_n, m_delta);
							vec.set(m_n, fi1);
						} else {
							var an = -2.0 * m_a * m_a / h;
							var bn = 2.0 * m_a * m_a / h + h / m_tau - m_c * h + (m_delta / m_gamma) * (2.0 * m_a * m_a + m_b * h);
							var dn = (h / m_tau) * matU.get(i, m_n) + fi1 * (2.0 * m_a * m_a + m_b * h) / m_gamma;

							mat.set(m_n, m_n - 1, an);
							mat.set(m_n, m_n, bn);
							vec.set(m_n, dn);
						}

						tma(mat, vec, vecRes);

						break;
				}

				for (var j = 0; j <= m_n; ++j) {
					matU.set(i + 1, j, vecRes.get(j));
				}

				break;
			}
		}
	}
}
