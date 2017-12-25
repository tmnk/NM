import numpy as np 

A = np.array([ [  28,   9,  -3,   -7   ],
            [-5, 21,  -5, -3],
            [-8, 1,  -16,   5],
            [  0,  -2, 5, 8]], dtype='float64')
b = np.array([-159.,63.,-45.,24.])

eps = 0.01

a = np.zeros((4,4))
for i in range(len(b)):
	for j in range(len(b)):
		if i == j:
			a[i][j] = 0
			continue
		a[i][j] = -A[i][j] / A[i][i]
	b[i] /= A[i][i]

prev, curr = np.zeros(len(b)), b 
def dif(a,b):
	if sum(abs(a[i] - b[i]) for i in range(len(b))) < eps:
		return False
	return True
itr = 0
while dif(curr, prev):
	prev = curr
	curr = np.dot(a, prev) + b
	itr += 1
print(curr, itr)
