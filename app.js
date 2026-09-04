// MT5 Dashboard - JavaScript Application

const API_ENDPOINTS = {
    // استفاده از API‌های رایگان برای قیمت‌های Forex
    forex: 'https://api.exchangerate-api.com/v4/latest/',
    crypto: 'https://api.coingecko.com/api/v3/simple/price',
    stocks: 'https://api.example.com/quote'
};

class MT5Dashboard {
    constructor() {
        this.symbols = ['EURUSD', 'GBPUSD', 'USDJPY'];
        this.priceData = {};
        this.autoRefreshEnabled = false;
        this.refreshInterval = 5000;
        this.chartInstance = null;
        this.historicalData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.createChart();
    }

    setupEventListeners() {
        document.getElementById('symbolInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSymbol();
            }
        });

        document.getElementById('refreshRate').addEventListener('change', (e) => {
            this.refreshInterval = parseInt(e.target.value) * 1000;
            if (this.autoRefreshEnabled) {
                clearInterval(this.autoRefreshTimer);
                this.startAutoRefresh();
            }
        });

        document.getElementById('timeframeSelect').addEventListener('change', () => {
            this.updateAllPrices();
        });
    }

    async loadInitialData() {
        console.log('🔄 درحال بارگذاری داده‌های اولیه...');
        for (const symbol of this.symbols) {
            await this.fetchPriceData(symbol);
        }
        this.renderPriceCards();
        this.updateChart();
        this.updateLastUpdateTime();
    }

    async fetchPriceData(symbol) {
        try {
            // شبیه‌سازی داده‌های MT5
            const mockData = this.generateMockPriceData(symbol);
            
            // برای Forex حقیقی، می‌توان از API استفاده کرد
            if (symbol.includes('USD')) {
                try {
                    const baseCurrency = symbol.substring(0, 3);
                    const quoteCurrency = symbol.substring(3, 6);
                    
                    const response = await fetch(`${API_ENDPOINTS.forex}${baseCurrency}?base=${quoteCurrency}`);
                    if (response.ok) {
                        const data = await response.json();
                        const rate = data.rates?.[quoteCurrency] || mockData.close;
                        mockData.close = rate;
                        mockData.bid = rate * 0.9998;
                        mockData.ask = rate * 1.0002;
                    }
                } catch (e) {
                    console.log(`⚠️ استفاده از داده‌های شبیه‌سازی برای ${symbol}`);
                }
            }
            
            this.priceData[symbol] = {
                ...mockData,
                symbol: symbol,
                timestamp: new Date(),
                lpeSignals: this.calculateLPESignals(mockData)
            };
            
            // ذخیره داده‌های تاریخی برای نمودار
            if (!this.historicalData[symbol]) {
                this.historicalData[symbol] = [];
            }
            
            this.historicalData[symbol].push({
                time: new Date(),
                price: mockData.close,
                high: mockData.high,
                low: mockData.low,
                volume: mockData.volume
            });
            
            // محدود کردن داده‌های تاریخی تا 100 نقطه
            if (this.historicalData[symbol].length > 100) {
                this.historicalData[symbol].shift();
            }
            
            console.log(`✅ ${symbol}: ${mockData.close}`);
        } catch (error) {
            console.error(`❌ خطا در دریافت داده برای ${symbol}:`, error);
        }
    }

    generateMockPriceData(symbol) {
        // شبیه‌سازی داده‌های واقع‌گرایانه برای نمایش
        const basePrice = {
            'EURUSD': 1.0850,
            'GBPUSD': 1.2650,
            'USDJPY': 150.45,
            'AUDUSD': 0.6750,
            'NZDUSD': 0.6200,
            'USDCAD': 1.3650,
            'USDCHF': 0.8950,
            'USDSGD': 1.3400
        }[symbol] || 1.0000;

        const volatility = 0.005; // 0.5% نوسان‌پذیری
        const randomChange = (Math.random() - 0.5) * volatility;
        const closePrice = basePrice * (1 + randomChange);
        const openPrice = basePrice * (1 + (Math.random() - 0.5) * volatility);
        const highPrice = Math.max(closePrice, openPrice) * (1 + Math.random() * 0.002);
        const lowPrice = Math.min(closePrice, openPrice) * (1 - Math.random() * 0.002);

        return {
            open: parseFloat(openPrice.toFixed(5)),
            high: parseFloat(highPrice.toFixed(5)),
            low: parseFloat(lowPrice.toFixed(5)),
            close: parseFloat(closePrice.toFixed(5)),
            bid: parseFloat((closePrice * 0.9998).toFixed(5)),
            ask: parseFloat((closePrice * 1.0002).toFixed(5)),
            volume: Math.floor(Math.random() * 1000000 + 500000),
            change: parseFloat(((closePrice - basePrice) / basePrice * 100).toFixed(2)),
            changePoints: parseFloat((closePrice - basePrice).toFixed(5))
        };
    }

    calculateLPESignals(priceData) {
        // حساب‌کردن سیگنال‌های LPE
        const signals = {};
        
        // Order Block Detection (شبیه‌سازی)
        const volatilityThreshold = Math.abs(priceData.high - priceData.low);
        signals.orderBlockStrength = Math.min(100, Math.floor(volatilityThreshold * 1000));
        
        // Fair Value Gap
        signals.fvgActive = priceData.change !== 0;
        signals.fvgSize = Math.abs(priceData.high - priceData.low);
        
        // Liquidity Sweep Projection
        signals.lspTarget = parseFloat((priceData.close + (priceData.close - priceData.low) * 0.5).toFixed(5));
        
        // BOS/CHOCH Detection
        signals.bosStrength = Math.random() * 100;
        signals.chochConfirmed = Math.random() > 0.6;
        
        return signals;
    }

    renderPriceCards() {
        const container = document.getElementById('priceCardsContainer');
        container.innerHTML = '';

        for (const symbol in this.priceData) {
            const data = this.priceData[symbol];
            const card = this.createPriceCard(data);
            container.appendChild(card);
        }
    }

    createPriceCard(data) {
        const card = document.createElement('div');
        card.className = 'price-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-symbol">${data.symbol}</span>
                <span class="card-timeframe">${document.getElementById('timeframeSelect').value}</span>
            </div>

            <div class="card-body">
                <div class="price-item">
                    <label>Open</label>
                    <value>${data.open.toFixed(5)}</value>
                </div>
                <div class="price-item">
                    <label>Close</label>
                    <value>${data.close.toFixed(5)}</value>
                </div>
                <div class="price-item">
                    <label>High</label>
                    <value>${data.high.toFixed(5)}</value>
                </div>
                <div class="price-item">
                    <label>Low</label>
                    <value>${data.low.toFixed(5)}</value>
                </div>
            </div>

            <div class="change-container">
                <div class="change-item">
                    <label>تغییر %</label>
                    <value class="${data.change >= 0 ? 'positive' : 'negative'}">
                        ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%
                    </value>
                </div>
                <div class="change-item">
                    <label>نقاط</label>
                    <value class="${data.changePoints >= 0 ? 'positive' : 'negative'}">
                        ${data.changePoints >= 0 ? '+' : ''}${data.changePoints.toFixed(5)}
                    </value>
                </div>
                <div class="change-item">
                    <label>Bid/Ask</label>
                    <value>${data.bid.toFixed(5)}/${data.ask.toFixed(5)}</value>
                </div>
            </div>

            <div class="lpe-signals">
                <div class="signal-item ${data.lpeSignals.chochConfirmed ? 'active' : ''}">
                    <span class="signal-label">🔄 BOS/CHOCH</span>
                    <span class="signal-value">${data.lpeSignals.bosStrength.toFixed(0)}%</span>
                </div>
                <div class="signal-item active">
                    <span class="signal-label">📦 Order Block</span>
                    <span class="signal-value">${data.lpeSignals.orderBlockStrength}%</span>
                </div>
                <div class="signal-item">
                    <span class="signal-label">📊 FVG</span>
                    <span class="signal-value">${data.lpeSignals.fvgSize.toFixed(5)}</span>
                </div>
                <div class="signal-item">
                    <span class="signal-label">🎯 LSP Target</span>
                    <span class="signal-value">${data.lpeSignals.lspTarget.toFixed(5)}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.highlightSymbol(data.symbol);
        });

        return card;
    }

    async updateAllPrices() {
        for (const symbol of this.symbols) {
            await this.fetchPriceData(symbol);
        }
        this.renderPriceCards();
        this.updateChart();
        this.updateLastUpdateTime();
    }

    addSymbol() {
        const input = document.getElementById('symbolInput');
        const symbol = input.value.toUpperCase().trim();

        if (symbol && !this.symbols.includes(symbol)) {
            this.symbols.push(symbol);
            input.value = '';
            this.loadInitialData();
        }
    }

    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        const btn = document.getElementById('autoRefreshBtn');

        if (this.autoRefreshEnabled) {
            btn.style.background = 'linear-gradient(135deg, var(--success) 0%, #00a8e8 100%)';
            btn.textContent = '⏱ توقف خودکار';
            this.startAutoRefresh();
        } else {
            btn.style.background = 'linear-gradient(135deg, var(--accent) 0%, var(--success) 100%)';
            btn.textContent = '⏱ فعال‌سازی خودکار';
            clearInterval(this.autoRefreshTimer);
        }
    }

    startAutoRefresh() {
        this.autoRefreshTimer = setInterval(() => {
            this.updateAllPrices();
        }, this.refreshInterval);
    }

    createChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#eaeaea',
                            font: { size: 12 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'نمودار قیمت - تاریخچه',
                        color: '#00d4ff'
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#eaeaea'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#eaeaea'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    updateChart() {
        const selectedSymbol = this.symbols[0];
        const data = this.historicalData[selectedSymbol] || [];

        if (data.length === 0) return;

        const labels = data.map(d => d.time.toLocaleTimeString('fa-IR'));
        const prices = data.map(d => d.price);

        this.chartInstance.data.labels = labels;
        this.chartInstance.data.datasets = [
            {
                label: selectedSymbol,
                data: prices,
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ff006e',
                pointBorderColor: '#00d4ff',
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ];

        this.chartInstance.update();
    }

    highlightSymbol(symbol) {
        console.log(`📌 نماد انتخاب‌شده: ${symbol}`);
        alert(`نماد ${symbol} انتخاب‌شد.\nاطلاعات تفصیلی در نسخه اصلی MT5 موجود است.`);
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fa-IR');
        document.getElementById('lastUpdate').textContent = timeString;
    }
}

// Global functions
function addSymbol() {
    dashboard.addSymbol();
}

function toggleAutoRefresh() {
    dashboard.toggleAutoRefresh();
}

// Initialize dashboard
const dashboard = new MT5Dashboard();