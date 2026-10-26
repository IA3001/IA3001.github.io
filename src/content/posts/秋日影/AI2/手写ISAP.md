---
title: 手写ISAP
date: 2026-10-26
published: true
updated: "2026-10-26T11:50:04+08:00"
---

### Code

```cpp
// BLOG2 本赛季 第二次补 网络流 默写代码
// 这个网络流 开的空间大小要求 看要求
// 坑点是：
// 1. 清空数据
// 2. memcpy cur
// 3. cur[u] = e[i].nxt 时机
// 4. dfs u == t return
// 5. bfs 不是 spfa
// 6. gap 不是 cnt
// 7. d 不是 dep 是 dist
// 8. 
#include<bits/stdc++.h>
using namespace std;
using ll = long long;
const ll INF = 1e18;

namespace ISAP {
    int n, s, t;
    const int N = 1005;
    const int M = 1e6 + 5;
    struct Edge {
        int to, nxt, w;
    } e[M];
    int cntE;
    int hd[N], cur[N];
    int d[N];
    int gap[N];
    
    void init(int nn) {
        n = nn;
        fill(hd,hd+1+nn,0);
        cntE = 1;
    }
    void add_edge(int u,int v,int w) {
        e[++cntE] = {v, hd[u], w};
        hd[u] = cntE;
        e[++cntE] = {u, hd[v], 0};
        hd[v] = cntE;
    }
    void bfs() {
        queue<int> Q;
        Q.push(t);
        fill(d,d+1+n,1e9);
        fill(gap,gap+1+n,0);
        gap[d[t]=0]++;
        while (Q.size()) {
            int u = Q.front();
            Q.pop();
            for(int i = hd[u];i;i=e[i].nxt) {
                int v = e[i].to, w = e[i].w;
                if (w) continue;
                if (d[v] > d[u] + 1) {
                    d[v] = d[u] + 1;
                    gap[d[v]]++;
                    Q.push(v);
                }
            }
        }
    }
    ll dfs(int u, ll sum) {
        if (u == t) return sum;
        ll res = 0, tk;
        for (int i = cur[u];i;i=e[i].nxt) {
            cur[u] = e[i].nxt;
            int v = e[i].to;
            ll w = e[i].w;
            if (d[v] == d[u] - 1 && w) {
                tk = dfs(v, min(sum, w));
                sum -= tk;
                res += tk;
                e[i].w -= tk;
                e[i^1].w += tk;
                if (!sum) {
                    return res;
                }
            }
        }
        if(!--gap[d[u]]) {
            d[s] = n + 1;
        }
        gap[++d[u]]++;
        return res;
    }
    
    ll cal(int ss,int tt) {
        s = ss, t = tt;
        bfs();
        ll res = 0;
        while(d[s] <= n) {
            memcpy(cur,hd, sizeof(hd[0]) * (n + 2));
            res += dfs(s, INF);
        }
        return res;
    }
}

const int N = 505;

int a[N], b[N];

void solve() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    for (int i = 1; i <= n; i++) {
        cin >> b[i];
    }
    ISAP::init(n * 2 + 2);
    int S = n * 2 + 1, T = S + 1;
    for (int i = 1; i <= n; i++) {
        ISAP::add_edge(S, i, 1);
        ISAP::add_edge(i+n, T, 1);
    }
    for (int i = 1;  i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (gcd(a[i], b[j]) == 1) {
                ISAP::add_edge(i, j + n, 1);
            }
        }
    }
    ll flow = ISAP::cal(S, T);
    if (flow == n) {
        cout << "Bob\n";
    } else {
        cout << "Alice\n";
    }
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
//     cin >> T;
    while (T--) solve();
}
```