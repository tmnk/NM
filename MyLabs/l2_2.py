import numpy as np
from math import *
from matplotlib import pyplot as plt
x1 = [i / 10 for i in range(0, 20)]
x2 = [1 + sin(i) for i in x1]
# plt.plot(x1,x2)
x2 = [i / 10 for i in range(0, 20)]
x1 = [1 + cos(i) for i in x2]
# plt.plot(x1,x2)
# plt.show()
x01 = 0.8
x02 = 1.75
#x1-cosx2-1
#x2-sinx1-1
def J(x1, x2):
	return 1 + cos(x1) * sin(x2)
def A1(x1, x2):
	return (x1 - cos(x2) - 1) - sin(x2) * (x2 - sin(x1) - 1)
def A2(x1, x2):
	return (x2 - sin(x1) - 1) + cos(x1) * (x1 - cos(x2) - 1)
# def f1(x1, x2):
# 	return (x1 - cos(x2) - 1)
# def f2(x1, x2):
# 	return (x2 - sin(x1) - 1)

eps = 0.0001
x1l, x2l = 0, 0
x1, x2 = x01, x02
itr = 0
while max(abs(x1 - x1l), abs(x2 - x2l)) > eps:
	x1l, x2l = x1, x2
	x1  = x1l - A1(x1l, x2l) / J(x1l, x2l)
	x2  = x2l - A2(x1l, x2l) / J(x1l, x2l)
	itr += 1
print("Newtoon = ",x1, x2, itr)

