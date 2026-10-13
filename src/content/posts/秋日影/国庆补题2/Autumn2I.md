---
title: 【秋日影】 Autumn2 I. Infinite Arrays
date: 2026-10-13
published: true
updated: "2026-10-13T22:16:10+08:00"
---

```cpp
// 今天来写一个 双向循环链表 <delist> 板子
// 想想 怎么写
// 主要的功能是 以一个约定好的编号 为切入点依据
// 为了好实现，我们的约定：
// 删除操作后，保证链表不为空！
// init n 表示初始化大小为 n 的双向循环链表 编号 1...n
// insert k v 表示在 编号 为 k 的节点 左侧 插入一个新的节点 值为 v 返回节点编号
// del k 表示 删除 编号 为 k 的节点
// get k 表示 查询编号为 k 的节点的值
// next k 表示 查询编号为 k 的节点 的 后继编号
// prev k 表示 查询编号为 k 的节点 的 前驱编号    
#include<bits/stdc++.h>
using namespace std;
using ll = long long;

struct delist {
    inline static const int N = 2e6 + 5;
    int tot;
    int sz;
    
    int pre[N], nxt[N];
    
    int val[N];

    void init(int n) {
        for (int i = 1; i <= n; i++) {
            pre[i] = i-1;
            nxt[i] = i+1;
            val[i] = int();
        }
        pre[1] = n;
        nxt[n] = 1;

        tot = n;
        sz = n;
    }
    int insert(int k,int v) {
        int i = ++tot; // 新建
        int p = pre[k]; // p -> i <- k
        nxt[nxt[p]=i]=k;
        pre[pre[k]=i]=p;
        sz++;
        return i;
    }
    void erase(int k) {
        int p = pre[k], q = nxt[k]; // p -> k <- q
        nxt[p] = q;
        pre[q] = p;
        sz--;
    }
    int& get(int k) {
        return val[k];
    }
    int prev(int k) {
        return pre[k];
    }
    int next(int k) {
        return nxt[k];
    }
    int size() {
        return sz;
    }
}L;

const int N = 2e6 + 5;

int n;
int P[N];
int A[N];

// 数字 i insert 后的编号
int id[N];


void solve() {
    cin >> n;

    // 初始化
    L.init(n);
    
    // 初始输入
    for (int i = 1; i <= n; i++) {
        cin >> P[i];
        L.get(i) = P[i];
        id[P[i]] = i;
    }

    int q;
    cin >> q;
    while (q--) {
        char op; 
        cin >> op;
        if (op == '-') {
            int x;
            cin >> x;
            int idx = id[x];
            L.erase(idx);
            id[x] = 0; // !!!!!!
        } else if (op == '+') {
            int y, z;
            cin >> y >> z;
            int idz = id[z];
            id[y] = L.insert(idz, y);
        } else {
            int k;
            cin >> k;
            for (int i = 1; i <= k; i++) cin >> A[i], A[i+k] = A[i]; // !!!
            int ans = 0, cnt = 0;
            int lst = 0;
            for (int i = 1; i <= k*2; i++) {
                if (lst && L.next(lst) == id[A[i]]) {
                    lst = L.next(lst);
                    cnt++;
                } else {
                    lst = id[A[i]];
                    cnt = lst > 0;
                }
                ans = max(ans, cnt);
            }
            if (ans == k * 2 && k >= L.size()) { // !!!
                cout << "*\n";
            }else cout << ans << "\n";
        }
    }
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    // cin >> T;
    while (T--) solve();
}
```
