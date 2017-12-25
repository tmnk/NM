import numpy as np
from math import *
from matplotlib import pyplot as plt
x = [i / 10 for i in range(0, 20)]
y1 = [sin(i) for i in x]
y2 = [2 * i * i - 0.5 for i in x]
# plt.plot(x, y1)
# plt.plot(x, y2)
# plt.show()
minimum = [100,0]
for i in range(len(x)):
	if abs(y1[i] - y2[i]) < minimum[0]:
		minimum = [abs(y1[i] - y2[i]), x[i]]
x0 = minimum[1]
def f(x):
	return sin(x) - 2 * x * x + 0.5
def f1(x):
	return cos(x) - 4 * x
def f2(x):
	return -sin(x) - 4
def check(x):
	return f(x) * f2(x) > 0
print(check(x0))

prev, curr = 0, x0 
eps = 0.001
while abs(prev - curr) > eps:
	prev = curr
	curr = prev - f(prev) / f1(prev)
print("Newtoon = ", curr)

def phi(x):
	return sqrt(0.5 * sin(x) / 2)

prev, curr = 0, x0 
eps = 0.001
while abs(prev - curr) > eps:
	prev = curr
	curr = phi(prev)
print("Iteration = ", curr)