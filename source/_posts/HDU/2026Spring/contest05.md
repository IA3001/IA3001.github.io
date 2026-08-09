---
title: 2026“钉耙编程”中国大学生算法设计春季联赛（5）
tags:
  - 2026杭电春季多校
  - HDU
published: true
---
## 1006 牧场

### Problem Description

在 $1000 \times 1000$ 的网格上，有 $n$ 个矩形，有 $q$ 次询问，每次查询禁用某 $k_i$ 个矩形后 $p_{i,1} \dots p_{i,k}$，剩下的矩形的覆盖面积。

数据范围：
- 多测 $T \le 5$
- $1 \le n, q \le 10^5$
- $1 \le x_{i,1}, x_{i,2}, y_{i,1}, y_{i,2} \le 1000$
- $1 \le k \le 7$ **（特别注意）**

### Solution

**随机化映射、01集合压缩映射**

- 唉！！！一样的杭电，一样的随机化哈希映射
- 由于每一次的查询的数量都很少，才 7 个，所以可以枚举最终会减少的空余块的类型是怎么叠加的，总共有 $2^7 - 1$ 种叠加方式哦
- 叠加方式，你想到了什么？哈希异或叠加状态啊！所以枚举所有的异或状态，把他们减去就是答案了！

**踩坑**

- **WA**：由于有差分，数组没开够，就差 1，落在边界上，直接 WA 了

### Code

```cpp
// 附加一个自定义 ULLL 哈希的板子
struct ULLLhash {
    size_t operator()(ULLL x) const {
        // 将高64位和低64位混合
        ULLL low = (ULLL)x;
        ULLL high = (ULLL)(x >> 64);
        return low ^ (high << 1);
    }
};
unordered_map<ULLL,int,ULLLhash> cnt;

while(q--) {
    int k;
    cin >> k;
    vector<int> id(k);
    for(auto& v:id) cin >> v;
    int res = tot;
    for(int s = 1; s < (1<<k);s++) {
        ULLL msk = 0;
        for (int i = 0; i < k; i++) {
            if (s >> i & 1) msk ^= h[id[i]];
        }
        if(cnt.count(msk)) res -= cnt[msk];
    }
    cout << res << " ";
}cout << "\n";
```

## 1009 走马观花

### Problem Description

$n$ 个点 $m$ 条无向边，每个点有 $a_i$ 点权，每条边都有边权 $w_i$。求边权最小的简单路径（边相连，没有重复的点）且满足点权之和为 $k$ 的倍数，不存在输出 -1。

数据范围：
- 多测 $T \le 10$
- $2 \le n \le 10^4$，$1 \le m \le 10^4$，$2 \le k \le 6$，$0 \le a_i \le k$，$1 \le w_i \le 10^9$
- 没有自环和重边

### Solution

**抽屉原理、爆搜（ex）**

由于**抽屉原理**：前缀和模 $k$ 的结果（含 0）必然有两个是相同的，故区间和可以为 $k$ 的倍数。

**踩坑**

- **UNK**：恶心的神秘**爆搜复杂度**，滚出 XCPC!

### Code

```cpp
void dfs(int u) {
    if(W >= ans) return;
    if(S % k == 0) {
        ans = W;
        return;
    }
    vis[u] = true;
    if(D < k) {
        for (auto [v, w]: e[u]) if(!vis[v]){
            D++;S+=a[v];W+=w;
            dfs(v);
            W-=w;S-=a[v];D--;
        }
    }
    vis[u] = false;
}
ans = 1e10;
D = S = W = 0;
for (int i = 1; i <= n; i++) {
    S += a[i];
    dfs(i);
    S -= a[i];
}
```

## 1010

### Problem Description

求

$$S(n, m) = \sum_{i=1}^{m} \phi(n \times i) \bmod p$$

其中：$1 \le n, m \le 10^9$，$10^8 \le p \le 10^9 + 7$

### Solution

**杜教筛、莫反、欧拉函数**

可以用欧拉公式的结论：$\phi(ab) = \frac{\phi(a) \phi(b) \gcd(a,b)}{\phi(\gcd(a,b))}$，但是我想直接推：

$$
\begin{aligned}
\sum_{i=1}^{m} \phi(n \times i) &= \sum_{i=1}^{m} \frac{\phi(n) \phi(i) \gcd(i,n)}{\phi(\gcd(i,n))} \\
&\text{简单移项} \\
&= \phi(n) \sum_{i=1}^{m} \phi(i) \frac{d}{\phi(d)} \quad \text{其中 } d = \gcd(i, n) \\
&\text{现在开始改变顺序，优先枚举 } d \\
&\text{（化简的目标可能就是优先枚举因子）} \\
&= \phi(n) \sum_{d \mid n} \frac{d}{\phi(d)} \sum_{i=1}^{m} \phi(i) [\gcd(i, n) = d] \\
&\text{把约束一般化} \\
&= \phi(n) \sum_{d \mid n} \frac{d}{\phi(d)} \sum_{i=1}^{m} \phi(i) [d \mid i] [\gcd(i/d, n/d) = 1] \\
&\text{单位函数莫反展开} \\
&= \phi(n) \sum_{d \mid n} \frac{d}{\phi(d)} \sum_{i=1}^{m} \phi(i) [d \mid i] \sum_{k \mid i/d,\ k \mid n/d} \mu(k) \\
&\text{此时换元 } T = kd \text{ 并要求 } d \mid T \\
&\text{（记住：枚举二级因子 } d, kd \text{ 时，优先枚举中间因子 } T \text{，不会遗漏）} \\
&= \phi(n) \sum_{d \mid n} \frac{d}{\phi(d)} \sum_{i=1}^{m} \phi(i) [d \mid i] \sum_{T \mid i,\ T \mid n} \mu(T / d) \\
&\text{由于 } T \mid i \text{ 所以反向枚举 } i \\
&\text{（这就是为什么要优先枚举因子，因为这样就会出现一种等差数列前缀和）} \\
&= \phi(n) \sum_{T \mid n} \sum_{d \mid T} \frac{d}{\phi(d)} \mu(T / d) \sum_{i=1}^{\lfloor m / T \rfloor} \phi(i T)
\end{aligned}
$$

看到积性函数 $h(T) = \sum_{d \mid T} \frac{d}{\phi(d)} \mu(T/d)$，一定要算一下他的素数幂处的取值啊，就比如 $p^e$。

切入点在于 $\mu(p^2) = 0$，而只有 $\mu(1) = 1, \mu(p) = -1$：

$$
\begin{aligned}
h(p) &= \frac{p}{\phi(p)} \mu(1) + \frac{1}{\phi(1)} \mu(p) \\
&= \frac{p}{p-1} - 1 \\
&= \frac{1}{p-1} \\
&= \frac{1}{\phi(p)}
\end{aligned}
$$

$$
\begin{aligned}
h(p^e) &= \frac{p^e}{p^{e-1} \times (p-1)} \mu(1) + \frac{p^{e-1}}{p^{e-2} \times (p-1)} \mu(p) \\
&= \frac{p^{e-1}}{p^{e-2} \times (p-1)} - \frac{p^{e-1}}{p^{e-2} \times (p-1)} \\
&= 0 \quad \text{（当 } e \ge 2 \text{ 时）}
\end{aligned}
$$

即（$\mu(T) \ne 0$，不懂的自己去看质数次幂处的取值）：

$$S(n,m) = \sum_{T \mid n,\ \mu(T) \ne 0} \frac{\phi(n)}{\phi(T)} \cdot S\left(T, \lfloor m / T \rfloor\right)$$

边界条件：

$$S(n,0) = 0，\quad S(1, m) = \sum_{i=1}^{m} \phi(i)$$

**踩坑**

- **UNK**：这个改变**求和顺序**真的是个谜！！！

### Code

```cpp
const int N = 1e7 + 5;

int n, m, mod;
int S_phi[N], phi[N], mu[N];
map<int,int> S_phi2;
int primes[N], cntP;
int factor[N];

void init() {
    mu[1] = phi[1] = 1;
    for (int i = 2; i < N; i++) {
        if(!factor[i]) {
            primes[++cntP] = i;
            mu[i] = -1;
            phi[i] = i - 1;
        }
        for (int j = 1; j <= cntP; j++) {
            int p = primes[j];
            int ip = p * i;
            if(ip >= N) break;
            factor[ip] = p;
            if(i % p == 0) {
                mu[ip] = 0;
                phi[ip] = phi[i] * p; // 我 chovy ! 写反了
                break;
            } else {
                mu[ip] = -mu[i];
                phi[ip] = phi[i] * (p - 1);
            }
        }
    }
}

int cal_mu(int n) {
    if(n < N) return mu[n];
    int res = 1;
    for (int j = 1; j <= cntP; j++) {
        int p = primes[j];
        if(p * p > n) break;
        if(n % p == 0) {
            n /= p;
            if(n % p == 0) return 0;
            res = -res;
        }
    }
    if(n > 1) res = -res;
    return res;
}

int cal_phi(int n) {
    if(n < N) return phi[n];
    int res = n;
    for (int j = 1; j <= cntP;j++) {
        int p = primes[j];
        if(p * p > n) break;
        if(n % p == 0) {
            while(n % p == 0) n/=p; // 我 chovy
            res = res / p * (p - 1);
        }
    }
    if(n>1) res = res / n * (n - 1);
    return res;
}

// phi 的前缀和是怎么求的来着, phi * 1 (n) = id(n) 
// 1 * S(n) = n(n+1)/2 - sum_(i = 2)^(n) 1 * S(floor.l n/i floor.r) 
int cal_S_phi(int n) {
    if(n < N) return S_phi[n];
    if(S_phi2.count(n)) return S_phi2[n];
    int res = (LL) n * (n + 1) / 2 % mod;
    int j;
    for (int i = 2; i <= n; i = (j + 1)) {
        j = n / (n / i);
        res = (res - (LL) (j - i + 1) * cal_S_phi(n/i) % mod + mod) % mod;
    }
    return S_phi2[n] = res;
}

int cal_S(int n, int m) {
    if(m == 0) return 0;
    if(n == 1) return cal_S_phi(m);
    int phi_n = cal_phi(n);
    int res = 0;
    for (int T = 1; T * T <= n; T++) {
        if(n % T == 0) {
            if(cal_mu(T)) {
                int phi_T = cal_phi(T);
                int tmp = phi_n / phi_T;
                res = (res + (LL) tmp * cal_S(T, m / T) % mod) % mod; 
            }
            if(n/T != T && cal_mu(n / T)) {
                int phi_nT = cal_phi(n/T);
                int tmp = phi_n / phi_nT;
                res = (res + (LL) tmp * cal_S(n / T, m / (n / T)) % mod) % mod; 
            }
        }
    }
    return res;
}

void solve() {
    cin >> n >> m >> mod;
    S_phi2.clear();
    for (int i = 1; i < N; i++) {
        S_phi[i] = (S_phi[i-1] + phi[i]) % mod;
    }
    cout << cal_S(n, m) << "\n";
}
```
