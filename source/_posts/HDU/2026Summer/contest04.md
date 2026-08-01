---
title: 2026“钉耙编程”中国大学生算法设计暑期联赛（4）
tags:
  - 杭电多校
  - HDU
published: true
---

## 1005 TREE

### Problem Description

给定一个长度为 $n$ 的排列 $a_1,a_2,\dots,a_n$。

对于一个非空序列 $b_1,b_2,\dots,b_k$，它的小根笛卡尔树是一棵满足以下条件的二叉树：

- 结点为序列中的 $k$ 个位置；
- 中序遍历依次得到位置 $1,2,\dots,k$；
- 每个结点对应的值都小于其儿子对应的值。

因为序列中的数互不相同，所以它的小根笛卡尔树唯一。

树根的深度定义为 $1$，其余结点的深度等于父亲深度加 $1$。树的高度是所有结点深度的最大值。

有 $q$ 次询问。每次给定一个区间 $[l,r]$，独立地取出序列

$$
a_l,a_{l+1},\dots,a_r
$$

建立它的小根笛卡尔树，并求出这棵树的高度。

数据范围：

- $1 \le T \le 10$；
- $1 \le n,q \le 2 \times 10^5$；
- $a_1,a_2,\dots,a_n$ 是 $1,2,\dots,n$ 的一个排列；
- $1 \le l \le r \le n$；
- 所有测试数据的 $n$ 之和不超过 $4 \times 10^5$；
- 所有测试数据的 $q$ 之和不超过 $4 \times 10^5$。

### Input

输入包含多组测试数据。第一行包含一个整数 $T$，表示测试数据组数。

对于每组测试数据：

- 第一行包含两个整数 $n,q$；
- 第二行包含 $n$ 个整数 $a_1,a_2,\dots,a_n$；
- 接下来 $q$ 行，每行包含两个整数 $l,r$，表示一次询问。

### Output

对于每次询问，输出一行一个整数，表示对应区间的小根笛卡尔树高度。

### Sample Input

```txt
3
1 2
1
1 1
1 1
5 6
3 1 5 2 4
1 5
1 3
3 5
2 4
3 3
4 5
7 6
3 2 4 1 6 5 7
1 7
1 3
5 7
2 6
3 5
4 4
```

### Sample Output

```txt
1
1
3
2
2
3
1
2
3
2
2
3
2
1
```

### Solution

**像这种，笛卡尔树，非平衡的树，在上面做文章的话**

- 除了 **启发式合并** 以外
- **ST 表** 维护信息是一个不错的选择

**本题着重考察了：中序遍历 与 跳父链 的关系，即**

- 左儿子跳父链时，其父亲的右儿子必然序号较大
- 右儿子跳父链是，其父亲的左儿子必然序号较小

据此，借鉴 **猫树** 的思想，将一次查询划分为：**左子树的后缀+右子树的前缀**

- 通过限定中间，向两边延伸的方式，天然的卡住了区间

此外，借鉴 **线段树维护区间矩阵乘法（结合律）** ， **ST 表** 同样可以维护以一个点为起始点，压缩倍增式的结合律操作（但是静态的）

- 结合律需要自己根据当前题目特性，寻找结合律运算关系
- 并且，切记不要弄反运算结合顺序
- 要注意：op（Fn） 结构体到底存储在父亲还是儿子上面，何时停止结合，初始值是多少
- 在树上，尤其需要基础的 `st[N][__lg(N) + 1]` jump 表

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 2e5 + 5;

int n, q, a[N];

struct Cartesian{
    int n, *a, P;
    int stk[N], tp;
    int lc[N], rc[N];
    int pre[N][__lg(N) + 1][2], suf[N][__lg(N) + 1][2];
    int st[N][__lg(N) + 1], dep[N];
    int h[N];
    int root;
    int cur[2], tmp[2];

    void build(int n,int* a) {
        #define mst(arr) memset(arr, 0, (sizeof arr[0]) * (this->n + 1))
        mst(pre); mst(suf); mst(st); mst(dep); mst(h); mst(lc); mst(rc);
        this->n = n;
        P = __lg(n);
        for (int i = 1, tp = 0, tmp; i <= n; i++) {
            tmp = tp;
            while(tp && a[stk[tp]] > a[i]) tp--;
            if (tp) rc[stk[tp]] = i;
            if (tp != tmp) lc[i] = stk[tp + 1];
            stk[++tp] = i;
        }
        root = stk[1];
        dfs0(root, 0);
        dfs1(root);
    }
    // 特别注意啊，不要结合反了！
    void merge(int* a,int* b,int* c) {
        c[0] = max(b[0], a[0] + b[1]);
        c[1] = a[1] + b[1];
    }
    void dfs0(int u,int f) {
        if (!u) return;

        dep[u] = dep[f] + 1;
        st[u][0] = f;
        h[u] = 1;
        
        dfs0(lc[u], u);
        dfs0(rc[u], u);

        if(f) h[f] = max(h[f], h[u] + 1);
        
        suf[lc[u]][0][0] = h[rc[u]] + 1;
        suf[lc[u]][0][1] = 1;
        
        pre[rc[u]][0][0] = h[lc[u]] + 1;
        pre[rc[u]][0][1] = 1;
    }
    void dfs1(int u) {
        if (!u) return;
        for (int p = 1; p <= P; p++) {
            int f = st[u][p-1];
            st[u][p] = st[f][p-1];
            merge(suf[u][p-1], suf[f][p-1], suf[u][p]);
            merge(pre[u][p-1], pre[f][p-1], pre[u][p]);
        }
        dfs1(lc[u]);
        dfs1(rc[u]);
    }

    int lca(int a,int b) {
        if (dep[a] < dep[b]) swap(a, b);
        for(int p = P;p>=0;p--) if (dep[st[a][p]] >= dep[b]) a=st[a][p];
        if (a == b) return a;
        for (int p = P;p>=0;p--) if(st[a][p]!=st[b][p]) a=st[a][p],b=st[b][p];
        return st[a][0];
    }

    int query(int l,int r) {
        int mid = lca(l ,r);
        int pref = 0, suff = 0;
        if (l != mid) {
            int t = 1 + h[rc[l]];
            cur[0] = 0, cur[1] = 0;
            for(int p = P;p>=0;p--) if (dep[st[l][p]]>dep[mid]) {
                merge(cur, suf[l][p], tmp);
                memcpy(cur,tmp,sizeof cur);
                l = st[l][p];
            }
            suff = max(cur[0], t + cur[1]);
        }
        if (r != mid) {
            int t = 1 + h[lc[r]];
            cur[0] = 0, cur[1] = 0;
            for(int p = P;p>=0;p--) if (dep[st[r][p]]>dep[mid]) {
                merge(cur, pre[r][p], tmp);
                memcpy(cur,tmp,sizeof cur);
                r = st[r][p];
            }
            pref = max(cur[0], t + cur[1]);
        }
        return max(pref, suff) + 1;
    }
}T;

void solve() {
    cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    T.build(n, a);
    for (int i = 1; i <= q; i++) {
        int l ,r;
        cin >> l >> r;
        cout << T.query(l, r) << "\n";
    }
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
```

