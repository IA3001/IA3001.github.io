---
title: Dirichlet前后缀和差分
date: 2026-11-03
published: true
updated: "2026-11-03T11:50:51+08:00"
---
- 注意
	- 顺序 枚举 各种质数
	- 前后缀差分是从出发

- 对于和
	- 前缀就从 `pi = p` 到 `pi <= n`
	- 后缀就从 `pi = n / p * p` 到 `pi >= p`
		- 注意同时，swap `f[pi]` 和 `f[i]` 的位置啊
- 对于差分
	- 不需要改 质数顺序
	- 顺序 i 从大到小 因为时光倒流
	- `+` 变 `-`

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;
using uint = unsigned int;

const int N = 2e7 + 5;

int primes[N/15], cntP;
int factor[N];

void init() {
    for (int i = 2; i < N; i++) {
        if (!factor[i]) {
            factor[i] = primes[++cntP] = i;
        }
        for (int j = 1; j <= cntP; j++) {
            int p = primes[j];
            int pi = p * i;
            if (pi >= N) break;
            factor[pi] = p;
            if (i % p == 0) break;
        }
    }
}

uint seed;
uint get_next() {
    seed^=seed<<13;
    seed^=seed>>17;
    seed^=seed<<5;
    return seed;
}

int n;
uint a[N], b[N];

void dirichlet_pre(uint* f, int n) {
    // !!!
    // 就是说 依次按照质数链贡献即可了
    for (int j = 1; j <= cntP; j++) {
        int p = primes[j];
        if (p > n) break; 
        // 开了 O2 优化，是很强的，因为 编译器会认识到这里的 reduce
        for (int i=1;p*i<=n;i++) {
            f[p*i] += f[i];
        }
    }
}

void dirichlet_ipre(uint* f, int n) {
    // !!!
    // 就是说 依次按照质数链贡献即可了
    for (int j = 1; j <= cntP; j++) {
        int p = primes[j];
        if (p > n) break; 
        // 开了 O2 优化，是很强的，因为 编译器会认识到这里的 reduce
        for (int i=n/p;p*i>=p;i--) {
            f[p*i] -= f[i];
        }
    }
}

void dirichlet_suf(uint* f, int n) {
    // !!!
    // 就是说 依次按照质数链贡献即可了
    for (int j = 1; j <= cntP; j++) {
        int p = primes[j];
        if (p > n) break; 
        // 开了 O2 优化，是很强的，因为 编译器会认识到这里的 reduce
        for (int i=n/p;p*i>=p;i--) {
            f[i] += f[p*i];
        }
    }
}

void dirichlet_isuf(uint* f, int n) {
    // !!!
    // 就是说 依次按照质数链贡献即可了
    for (int j = 1; j <= cntP; j++) {
        int p = primes[j];
        if (p > n) break; 
        // 开了 O2 优化，是很强的，因为 编译器会认识到这里的 reduce
        for (int i=1;p*i<=n;i++) {
            f[i] -= f[p*i];
        }
    }
}

void solve() {
    cin >> n >> seed;
    for (int i = 1; i <= n; i++) a[i] = get_next();
    memcpy(b,a,sizeof(a[0])*(n+1));
    dirichlet_pre(b, n);
    uint res = 0;
    for (int i = 1; i <= n; i++) res ^= b[i];
    cout << res << "\n";
}

int main() {
    init();
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    // cin >> T;
    while (T--) solve();
}
```

