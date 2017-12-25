import numpy as np

def solve(a,b,c,d):
	p, q = 0, 0
	P, Q = [], []
	for i in range(len(a)):
		P.append(-c[i]             / (b[i] + a[i] * p))
		Q.append((d[i] - a[i] * q) / (b[i] + a[i] * p))
		p, q = P[-1], Q[-1]
	x = [i for i in range(len(a) + 1)]
	for i in reversed(range(len(a))):
		x[i] = P[i] * x[i + 1] + Q[i]
	return x
# a = [0, -1, 2, -1]
# b = [8, 6, 10, 6]
# c = [-2, -2, -4, 0]
# d = [6,3,8,5]
a = [0,6,-3,-9,-5]
c = [-6,0,0,8,0]
b = [-7,12,5,21,-6]
d = [-75,126,13,-40,-24]
x = solve(a, b, c, d)
print(x[:-1])		