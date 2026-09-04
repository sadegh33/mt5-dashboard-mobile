# 📊 MT5 Advanced Real-Time Price Dashboard

**Interactive web dashboard for displaying advanced Forex prices with LPE signals**

## 🎯 Features

### 1. **Advanced Price Display**
- ✅ Real-time Open, High, Low, Close (OHLC)
- ✅ Bid/Ask Spread visualization
- ✅ Percentage and Points change calculation
- ✅ Instant price updates

### 2. **LPE (Liquidity Pattern Engine) Signals**
- 📦 **Order Block Detection** - Identifies order accumulation zones
- 📊 **Fair Value Gap (FVG)** - Shows value inefficiencies
- 🎯 **LSP Target** - Liquidity Sweep Projection
- 🔄 **BOS/CHOCH** - Break of Structure / Change of Character detection

### 3. **Mobile-First Design**
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Dark theme with cyan accent colors
- ⚡ Fast loading and smooth animations
- 🪶 Lightweight (no heavy frameworks)

### 4. **Interactive Features**
- ✚ Add multiple trading symbols
- ⏱ Adjustable refresh rates
- 🔄 Auto-refresh toggle
- 📊 Timeframe selection (M1, M5, M15, H1, D1, W1)
- 📈 Historical price chart

### 5. **Real-Time Updates**
- Live quote updates every 5 seconds (configurable)
- Automatic data refresh
- Timestamp tracking
- Volume monitoring

## 🚀 Getting Started

### Option 1: Use Directly (No Setup Required)
1. Visit: https://sadegh33.github.io/mt5-dashboard-mobile
2. Open on mobile or desktop
3. Start trading!

### Option 2: Local Deployment
```bash
git clone https://github.com/sadegh33/mt5-dashboard-mobile.git
cd mt5-dashboard-mobile

# Option A: Python 3
python -m http.server 8000

# Option B: Node.js
npx http-server

# Then open: http://localhost:8000
```

### Option 3: Cloud Hosting (Netlify)
```bash
# 1. Connect GitHub repo to Netlify
# 2. Auto-deploys on every push
# 3. Get live URL instantly
```

## 📱 Access from Mobile

### Same Wi-Fi Network:
```
1. Get your computer's IP:
   - Windows: ipconfig
   - Mac/Linux: ifconfig
2. On mobile: http://192.168.1.100:8000
3. Both devices must be on same network
```

### Via Cloud URL:
```
- Deploy to GitHub Pages (free)
- Deploy to Netlify (free)
- Access worldwide via public link
```

### Via QR Code:
```
1. Generate QR code for your URL
2. Scan with mobile phone
3. Instant access!
```

## 🔗 Live Demo

**[https://sadegh33.github.io/mt5-dashboard-mobile](https://sadegh33.github.io/mt5-dashboard-mobile)**

## 📊 Data Sources

### APIs Used:
- **Forex**: ExchangeRate API (free tier)
- **Crypto**: CoinGecko API (free)
- **Signals**: LPE Algorithm (calculated locally)

### Update Frequency:
- Default: 5 seconds (configurable)
- Range: 1-60 seconds
- Auto-refresh on demand

## 🎨 UI/UX Theme

```
🔵 Primary Dark: #1a1a2e
💜 Secondary Dark: #16213e
🏠 Accent Blue: #0f3460
💙 Cyan Success: #00d4ff
❌ Red Danger: #ff006e
⚠️ Yellow Warning: #ffd60a
⚪ Light Text: #eaeaea
```

## 🔧 Configuration

### Add Custom Symbols:
```javascript
// In app.js, modify:
this.symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'YOUR_SYMBOL'];
```

### Custom LPE Signals:
```javascript
calculateLPESignals(priceData) {
    // Implement your signal logic
    return {
        orderBlockStrength: 75,
        fvgActive: true,
        lspTarget: 1.0950,
        bosStrength: 85,
        chochConfirmed: true
    };
}
```

### Connect to Real MT5 Data:
```javascript
// Requires MT5 WebSocket server or API bridge
const ws = new WebSocket('ws://mt5-server:port');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    this.priceData[data.symbol] = data;
    this.renderPriceCards();
};
```

## 🌐 Browser Support

✅ Chrome 60+
✅ Firefox 55+
✅ Safari 11+
✅ Edge 79+
✅ Mobile browsers (iOS Safari, Chrome Android)

## 📈 Performance

- **Load Time**: < 2 seconds
- **Bundle Size**: < 100KB
- **Memory Usage**: ~10-50MB
- **CPU Usage**: Minimal

## ⚠️ Limitations

- 🏠 Free APIs have rate limits
- 🏠 Prices may have slight delays
- 🏠 No real-time MT5 integration by default
- 🏠 Browser storage limited to 5-10MB

## 🔐 Security & Privacy

- ✅ No personal data storage
- ✅ No authentication required
- ✅ Client-side only (no backend)
- ✅ Open source and auditable
- ✅ No cookies or tracking

## 🐛 Troubleshooting

### Prices not updating:
```javascript
// Check if auto-refresh is enabled
// Open DevTools: F12 > Console
// Look for API errors
```

### Chart not showing:
```javascript
// Verify Chart.js is loaded
console.log(typeof Chart); // Should show: "function"
```

### Mobile not accessing:
```
1. Ensure same Wi-Fi network
2. Check firewall settings
3. Use IP address, not localhost
4. Try: http://192.168.x.x:8000
```

## 🚀 Roadmap

- [ ] WebSocket integration for live MT5 data
- [ ] User profile saving
- [ ] Push notifications
- [ ] Advanced technical analysis
- [ ] Trading journal integration
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Export data to CSV/PDF

## 📝 File Structure

```
mt5-dashboard-mobile/
├── index.html           # Main HTML (single file)
├── app.js               # JavaScript logic
├── README.md            # English documentation
└── .github/
    └── workflows/       # CI/CD pipelines
```

## 💡 Tips & Tricks

1. **Save as Web App**:
   - Mobile: Share > Add to Home Screen
   - Desktop: Menu > Install app

2. **Keyboard Shortcuts**:
   - Enter = Add symbol
   - Auto-refresh button = Toggle on/off

3. **Performance Boost**:
   - Close browser tabs
   - Reduce refresh rate if CPU high
   - Clear cache if laggy

## 📞 Support

**Issues?**
1. Open DevTools: F12
2. Check Console for errors
3. Open GitHub Issue with screenshot
4. Include browser version and OS

## 🤝 Contributing

Contributions welcome!
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - Free to use, modify, and distribute

---

**Version**: 1.0.0
**Last Updated**: 2026-09-04
**Developer**: @sadegh33
**Status**: ✅ Production Ready
