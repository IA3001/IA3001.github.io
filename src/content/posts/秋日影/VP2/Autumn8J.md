---
title: 【秋日影】 Autumn8 J. 最小格点相似三角形
date: 2026-10-13
published: true
updated: 2026-10-13T22:25:04+08:00
tags:
  - 高斯gcd
---
### Code

```cpp
// BLOG2
// 有收获
// 复数域 GCD
// 可以用于 约分 三角形
// 使得 可以用一个复数 表示出来 一个 不定位置 但是定比例 的 相似三角形族
#include<bits/stdc++.h>
using namespace std;
using ll = long long;

// 四舍五入的除法 NB!!!
ll round(ll a, ll b) {
    ll f = 1;
    if (a < 0) a = -a, f *=-1;
    if (b < 0) b = -b, f *=-1;
    return f * ((a*2+b)/(b*2));
}

// 整型复数 NB!!!
struct Cp {
    ll x, y;
    Cp conj() const {
        return {x,-y};
    }
    Cp operator+(Cp o) const {
        return {x+o.x,y+o.y};
    }
    Cp operator-(Cp o) const {
        return {x-o.x,y-o.y};
    }
    Cp operator-() const {
        return {-x,-y};
    }
    Cp operator*(Cp o) const {
        return {
            x*o.x-y*o.y,
            x*o.y+y*o.x
        };
    }
    Cp operator/(Cp o) const {
        Cp a = *this * o.conj();
        ll b = o.norm();
        return {
            round(a.x,b),
            round(a.y,b)
        };
    }
    Cp operator%(Cp o) const {
        return (*this) - ((*this/o) * o);
    }
    ll norm() const {
        return x*x + y*y;
    }
}A,B,C;

// 复数域 GCD NB!!!
Cp gcd(Cp a, Cp b) {
    return !b.norm()? a: gcd(b,a%b);
}

void solve() {
    cin >> A.x >> A.y >> B.x >> B.y >> C.x >> C.y;
    B = B-A;
    C = C-A;
    Cp g = gcd(B, C);
    B = B / g;
    C = C / g;
    // ll mnx = min({0ll,B.x,C.x});
    // ll mny = min({0ll,B.y,C.y});
    // mnx += 1e9;
    // mny += 1e9;
    ll mnx = 0, mny = 0; // ??? 这也能过?
    cout << 0-mnx << " " << 0-mny << " " << B.x-mnx << " " << B.y-mny << " " << C.x-mnx << " " << C.y-mny << "\n";
}

int main() {
    // cout << (LONG_LONG_MAX) << "\n";
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
/*
1
-1 -1 1 0 -2 1

LLONG_MAX
9'223'372'036'854'775'807

9e18
2e9*2e9 = 4e18 ok
*/
```