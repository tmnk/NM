import matplotlib.pyplot as plt
import numpy as np
import math as m
from functools import reduce

n = 5
xi = np.array([-3.,-1.,1.,3.,5.])
yi = np.array([-1.2490, -0.78540,  0.78540, 1.2490,  1.3734])


def sum_pow(x,p):
    return sum(map(lambda x: x**p, x))
    
def F1(ai, x):
    return ai[0] + ai[1]*x

A = np.array([[n+1, sum(xi)],
              [sum(xi), sum(map(lambda x: x**2, xi))]])

d = np.array([sum(yi), sum(xi*yi)])
ai = np.linalg.solve(A, d)

res1 = [y for y in map(lambda x: F1(ai,x), xi)]

F1_res = sum(map(lambda x: x**2, (res1 - yi)))
print("Sum q er 1", F1_res)

def F2(ai, x):
    return ai[0] + ai[1]*x + ai[2]*(x**2)

A = np.array([[n+1           , sum(xi)       , sum_pow(xi, 2)],
              [sum(xi)       , sum_pow(xi, 2), sum_pow(xi, 3)],
              [sum_pow(xi, 2), sum_pow(xi, 3), sum_pow(xi, 4)]])
d = np.array([sum(yi), sum(xi*yi), sum(yi*xi*xi)])

ai = np.linalg.solve(A, d)
res2 = [y for y in map(lambda x: F2(ai, x), xi)]
F2_res = sum_pow(res2 - yi,2)
print("Sum q er 2", F2_res)
plt.scatter(xi, yi)
plt.plot(xi, res1)
plt.plot(xi, res2)
plt.show()
# draw(yi, res1, res2)
