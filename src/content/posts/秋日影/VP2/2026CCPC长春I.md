---
title: 2026CCPC长春I
date: 2026-10-24
published: true
updated: "2026-10-24T19:33:14+08:00"
---

### Code

```cpp
// BLOG2 
// 2026 CCPC 长春 I
// 近几天的 3 个 通信题 一个都做不出来 闹麻了
// 估计 都是 01 编码 的各种 trick 题目啊
// 今天这个 用的是 
// 1. min(a, b) <= n / 2
// 2. 首比特 的 0/1 信息作用
// 唉呀 
// 从而节省空间
#include<bits/stdc++.h>
using namespace std;

const int N = 2e5 + 5;

int n, r;
string s;

string encode(string s) {
    int n = s.size();
    string t;
    char minority = count(s.begin(), s.end(), '0') * 2 <= n ? '0' : '1'; // 少的是不是 0 
    // 认为 0 少 1 多
    char cur = minority;
    for (int i = 0; i < n; i++) {
        t += cur;
        if (s[i] == minority) t += cur;
        cur ^= 1;
    }
    return t;
}

string decode(string s) {
    int n = s.size();
    string t;
    char minority = s[0];
    for (int i = 0; i < n; i++) {
        if (i + 1 < n && s[i] == s[i+1]) {
            // 少的那个占用 s[0]
            t += minority;
            i++;
        } else {
            t += minority^1;
        }
    }
    return t;
}

void solve() {
    if (r == 1) {
        cin >> n >> s;
        string t = encode(s);
        cout << t.size() << "\n";
        cout << t << "\n";
    } else if (r == 2) {
        cin >> n >> s;
        string t = decode(s);
        cout << t.size() << "\n";
        cout << t << "\n";
    } 
    cout.flush();
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T >> r;
    while (T--) solve();
}
```