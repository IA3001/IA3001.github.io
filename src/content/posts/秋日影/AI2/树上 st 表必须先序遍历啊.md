---
title: 树上 st 表必须先序遍历啊
date: 2026-10-27
published: true
updated: "2026-10-27T00:15:20+08:00"
---

### Code

```cpp
// BLOG2 服了 我太糖了
// 这个， st 表建立 和 定义 
// 尤其是这个 st 表的建立顺序啊！
// 之前是
// 1. 先遍历 p
// 现在又来了一点
// 2. 树上线序遍历建立 ST 表啊啊
#include<bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 5e5 + 5;

int n;
vector<int> e[N];
int deg[N];
int st[N][20];
int stjump[N][20];
int h[N];
int dep[N];

void dfs(int u,int f) {
    int mx1 = 0, mx2 = 0;
    dep[u] = dep[f] + 1;
    stjump[u][0] = f;
    for (auto v: e[u]) if (v != f) {
        dfs(v, u);
        mx2 = max(mx2, h[v]);
        if (mx2 > mx1) swap(mx2, mx1);
    }
    h[u] = mx1 + 1;
    for (auto v: e[u]) if (v != f) {
        st[v][0] = h[v] == mx1 ? mx2 : mx1;
    }
}

void dfs2(int u,int f) {
    for (int p=1;p<20;p++) {
        stjump[u][p] = stjump[stjump[u][p-1]][p-1];
        st[u][p] = max(st[u][p-1], st[stjump[u][p-1]][p-1]);
    }
    for(auto v:e[u]) if (v != f) dfs2(v, u); 
}

void solve() {
    cin >> n;
    for (int i = 1;  i < n; i++) {
        int u, v;
        cin >> u >> v;
        deg[u]++;
        deg[v]++;
        e[u].push_back(v);
        e[v].push_back(u);
    }
    dfs(1, 0);
    dfs2(1, 0);
    int ans = 0;
    for (int i = 2; i <= n; i++) {
        if (deg[i] == 1) {
            int u = i;
            int res = 1;
            for (int p = 19; p >= 0; p--) {
                if (stjump[u][p]) {
                    res = max(res, st[u][p]);
                    u = stjump[u][p];
                }
            }
            ans = max(ans, dep[i] + res - 1);
        }
    }
    cout << ans << "\n";
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    while (T--) solve();
}
```