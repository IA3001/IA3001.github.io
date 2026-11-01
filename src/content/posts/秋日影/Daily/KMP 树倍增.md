---
title: KMP 树倍增
date: 2026-11-01
published: true
updated: "2026-11-01T10:24:46+08:00"
---

> 事实上这个 其实不需要倍增啊
> 
> 这个，居然维护中轴居然就可以 $O(n)$ 

![](assets/KMP%20树倍增/file-20261101102256453.png)
### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 1e6 + 5;
const ll mod = 1e9 + 7;

int n;
string s;
int fa[N][20], dep[N];

void solve() {
    cin >> s;
    n = s.size();
    s = " " + s;
    dep[1] = 1;
    // j 表示的是将要比较的位置 因此实际匹配了 j-1 个
    ll ans = 1;
    for (int i = 2, j = 1; i <= n; i++) {
        while(j > 1 && s[i] != s[j]) j = fa[j-1][0] + 1; // !!!
        if (s[i] == s[j]) j++;
        fa[i][0] = j - 1; // !
        dep[i] = dep[j-1] + 1;
        for (int p = 1; p < 20; p++) {
            fa[i][p] = fa[fa[i][p-1]][p-1];
        }
        int u = i;
        for (int p = 19; p >= 0; p--) {
            if (fa[u][p] > i / 2) u = fa[u][p];
        }
        if (u > i / 2) u = fa[u][0];
        ans = ans * (dep[u] + 1) % mod;
    }
    cout << ans << "\n";
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
```