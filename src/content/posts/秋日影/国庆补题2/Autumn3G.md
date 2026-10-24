---
title: 【秋日影】 Autumn3 G. Image Recognition
date: 2026-10-15
published: true
updated: "2026-10-15T11:27:12+08:00"
---

### Code

```cpp
// BLOG2
// 这一次，学会了
// 
// 一个硬伤：
// string 转 bitset 或者 cin >> bitset
// 他会 以人类阅读方式 提取数值
// 而 索引 是从 右端开始的
// 所以说，按照正常我的 01Trie 来说，是小端起始插入，那么
// bitset 以 人类 string 转化是对的
// 但是呢？
// 我要排序的话， bitset 不支持排序啊
// 所以啊，必须借助 string 
// 但是呢， string 和 bitset 的存储正好反过来的
// 所以啊，不得不用 reverse 和 bitset 语义对齐
// 所以，排序不得不临时对 string reverse
// 注意，必须， reverse 大小端 的排序结果并不一致
// 
// 2类 Trick
// 1. 01 Trie 隐式维护： 其实就是 int 排个序
// 两数值(小端) 之间的 lcp 就是 prefix(ctz(a^b))
// 
// 2. 最小编码掩码（关于最小的问题是一个 NP 问题）
// 而问题的上限就是这个题目
// 所以啊，怎么求呢 K-1 ？
// 其实就是如果你想出来，使用二叉树的方式的话
// 就会想到 01 Trie 
// 那么，直接 01 Trie 建立虚树，去重关键节点数量，就可以了
// 其实不用建立虚树，因为 这是 01 Trie 
#include<bits/stdc++.h>
using namespace std;

const int N = 2005, M = 4005;

int n,m,q;
pair<string,int> s[N];
bitset<M> b[N];
int rnk[N];

void solve() {
    cin >> n >> m >> q;
    for (int i = 0; i < n; i++) {
        auto& [str, id] = s[i]; 
        cin >> str;
        id = i;
    }
    sort(s,s+n);
    for (int i = 0; i < n; i++) {
        rnk[s[i].second] = i;
        reverse(s[i].first.begin(), s[i].first.end());
        b[s[i].second] = bitset<M>(s[i].first);
    }
    for (int i = 1; i <= q; i++) {
        int k;
        cin >> k;
        vector<int> ord(k);
        for (auto& v: ord) cin >> v;
        sort(ord.begin(),ord.end(),[&](int a,int b) {
            return rnk[a] < rnk[b];
        });
        set<int> S;
        for (int i = 1; i < k; i++) {
            int u = ord[i-1], v= ord[i];
            S.insert((b[u]^b[v])._Find_first());
        }
        cout << S.size() << " ";
        for (auto p : S) cout << p << " ";
        cout << "\n";
    }
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    for (int i = 1; i <= T; i++) {
        cout << "Case #" << i << ":\n";
        solve();
    }
}
```