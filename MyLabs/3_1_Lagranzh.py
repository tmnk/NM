import numpy as np
import math as m

"""Лагранж"""
pi = m.pi

def print_lagr(f0w4, f1w4, f2w4, f3w4, x0, x1, x2, x3):
    print(f0w4, "(x -", x1,") (x -", x2, ") (x -", x3,")+",
            f1w4, "(x -", x0,") (x -", x2, ") (x -", x3,")+",
            f2w4, "(x -", x0,") (x -", x1, ") (x -", x3,")+",
            f3w4, "(x -", x0,") (x -", x1, ") (x -", x2,")"
          )

def count_lagr(fw, x, x_c):
    res = 0
    for i in range(4):
        wi = 1
        for j in range(4):   
            if i != j:
                wi *= x_c - x[j]
        res+=fw[i]*wi
    return res

def f(x):
    #return m.log(x)
    return m.tan(x) + x
#X = np.array([0.1, 0.5, 0.9, 1.3])
X = np.array([0, pi/8, 2*pi/8, 3*pi/8], float)
def w4(x, i):
    res = 1
    tmp_x = np.repeat(x, 4)
    tmp_x = tmp_x - X
    for m in range(4):
        if m != i:
            res*=tmp_x[m]
    return res
    
#X_C = 0.8
X_C = 3*pi/16
FW = np.empty(4)

fi = 0
wi4 = 0
for i in range(4):
    fi = f(X[i])
    wi4 = w4(X[i], i)
    FW[i] = fi/wi4
    print(i, X[i], fi, wi4, FW[i], X_C - X[i])

print("\n")
print_lagr(FW[0], FW[1],FW[2],FW[3], X[0], X[1], X[2],X[3])
print("\n")
print("L(X) =", count_lagr(FW, X, X_C))
print("F(X) =", f(X_C))
print("абсолютная погрешность :", abs(f(X_C)) - abs(count_lagr(FW, X, X_C)))