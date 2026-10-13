---
title: 【秋日影】Autumn2 H. Horrible Restaurants
date: 2026-10-13
published: true
updated: "2026-10-13T22:20:07+08:00"
---

> 我的 这个 Blog Editor 显得有点鸡肋了
>
> 尤其是到了现在，想要创建一个专属的专题还得手动创建
>
> 我尝试转到 Obsidian 或者 VS Code 吧还是
>
> 我觉得 以 Obsidian 为主吧我觉得 因为 Obsidian 用起来挺舒服的
>
> 就是那个 latex 如果要写公式块 写起来很难受啊

```cpp
// BLOG2
// 这一题，学到了什么？
// 1. 有时候，
// 小范围的 暴力 修改 暴力 查询变化
// 比 在线 维护一个 复杂的数据结构 更快
// 2. 很可能当你在做一个模拟题的时候
// 很多的操作 都是 固定的 变参 的
// 如何优雅实现？
// 不妨定义一种 硬核全局常量 struct  
// 比如 Plan Change int[] = ...
// 这样，就优雅了一些
// 不要语法错了数组写 const int *
#include<bits/stdc++.h>
using namespace std;
using ll = long long;

using Pair = pair<ll,int>;
using Set = set<Pair>;

const int N = 2e5 + 5;

int n;
int c[N][4];

Set _s[7];
Set* s = &_s[3];

int level[N];
ll sum;

void use(int id) {
    for (int nl = 0; nl <= 3; nl++) {
        if (nl == level[id]) continue;
        s[nl-level[id]].insert({c[id][nl]-c[id][level[id]], id});
    }
}

void unuse(int id) {
    for (int nl = 0; nl <= 3; nl++) {
        if (nl == level[id]) continue;
        s[nl-level[id]].erase({c[id][nl]-c[id][level[id]], id});
    }
}

// 真实实施 正式找那个 最优的贡献
void apply(int d) {
    auto [val, id] = *s[d].begin();
    unuse(id);
    sum -= c[id][level[id]];
    level[id] += d;
    sum += c[id][level[id]];
    use(id);
}

// 暴力辅助1：硬核编码

struct Plan {
    const int* a;
    int len;
};

int a1[] = {1};
int a12[] = {-1,2};
int a23[] = {-2,3};
int a113[] = {-1,-1,3};
int a322[] = {-3,2,2};

Plan plans[5] = {
    {a1, 1},
    {a12,2},
    {a23,2},
    {a113,3},
    {a322,3},
};

// 暴力辅助2： 临时查阅 O(1) 表
// 放置 5log 暴力在线修改 use / unuse

struct Change {
    int id; // 贡献者
    int d; // 已经偏移量
};

// 模拟一次计划，并给出模拟答案
ll simulate(Plan p) {
    Change changes[3];
    auto [a, len] = p;
    int cnt = 0;
    ll res = 0;
    // 必须模拟这里面的操作
    for (int i = 0; i < len; i++) {
        int d = a[i];
        ll v = 2e18; // 最小收益
        int k = -1; // 收益贡献者
        // 找一个 d 不从 change 里面
        for (auto it = s[d].begin(); it != s[d].end(); it++) {
            auto [val, id] = *it;
            bool ok = true;
            for (int j = 0; j < cnt; j++) {
                ok &= changes[j].id != id;
            }
            // 没有变过
            if (ok) {
                // 找到了收益 及其贡献者
                v = val;
                k = id;
                break;
            }
        }
        // 从 change 里面找 需要答应我： change 的值比当前的收益大
        for (int j = 0; j < cnt; j++) {
            // change 了的，不一定就不是候选
            auto [jid, jd] = changes[j];
            int jl = level[jid] + jd;
            if (jl + d >= 0 && jl + d <= 3) {
                ll jv = c[jid][jl+d] - c[jid][jl];
                if (jv < v) {
                    // 新的收益 及其贡献者
                    v = jv;
                    k = jid;
                }
            } 
        }
        // 找不到
        if (k == -1) return 2e18;
        // 找到了
        // 看他是否是在 change 的，如果是 change 里面的，说明是二次 change
        int pos = -1;
        for (int j = 0; j < cnt; j++) {
            if(changes[j].id == k) {
                pos = j;
                break;
            }
        }
        if (pos == -1) {
            // 新的
            changes[cnt++] = {k, d}; // 贡献者 及其 变化量
        } else {
            // 已有的，那么change 叠加
            changes[pos].d += d;
        }
        // 收益加上
        res += v;
    }
    return res;
}

void solve() {
    cin >> n;
    for (int i = 1; i <= n; i++) {
        auto& [c0,c1,c2,c3] = c[i];
        cin >> c1 >> c2 >> c3;
        use(i);
    }
    for (int i = 1; i <= n*3; i++) {
        ll ans = 1e18;
        int best = -1;
        for (int j = 0; j < 5; j++) {
            // simulate 只需要算出来 变化量收益最小的即可
            ll res = simulate(plans[j]);
            if (ans > res) {
                ans = res;
                best = j;
            }
        }
        assert(best != -1);
        for (int j = 0; j < plans[best].len; j++) {
            apply(plans[best].a[j]);
        }
        cout << sum << "\n";
    }
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    // cin >> T;
    while (T--) solve();
}
```
