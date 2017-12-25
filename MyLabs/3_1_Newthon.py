import numpy as np
from math import *

def f(x):
    return atan(x)
X = np.array([-3, -1, 1, 3], float)
X_C = -0.5    
def count_newton(res, x):
    return (f(X[0])+res[0]*(x - X[0]) +
                    res[1]*(x - X[0])*(x - X[1]) +
                    res[2]*(x - X[0])*(x - X[1])*(x - X[2]))


fi = [n for n in map(lambda x: f(x), X)]
res = np.zeros(3)
for i in range(1,4):
    for j in range(1,4-(i-1)):
        if j == 1:
            res[i-1] = (fi[j] - fi[j-1])/(X[i] - X[0])
        fi[j-1] = (fi[j] - fi[j-1])/(X[i] - X[0])    
   

print("P(x) =",count_newton(res, X_C))
print("F(x) =",f(X_C))
print(abs(f(X_C)) - abs(count_newton(res, X_C)))