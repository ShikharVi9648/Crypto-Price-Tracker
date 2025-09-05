let allCryptos = [];
let filteredCryptos = [];

const cryptoGrid = document.querySelector(".crypto-grid");
const refreshBtn = document.querySelector(".refresh-btn");
const searchInput = document.querySelector(".search-input");
const lastUpdated = document.querySelector(".last-updated");

// Popular cryptocurrencies to show by default
const topCryptos = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
  "usd-coin",
  "cardano",
  "dogecoin",
  "avalanche-2",
  "tron",
  "polkadot",
  "matic-network",
  "litecoin",
  "shiba-inu",
  "chainlink",
  "bitcoin-cash",
  "uniswap",
  "internet-computer",
  "wrapped-bitcoin",
  "filecoin",
  "stellar",
  "dai",
  "aptos",
  "near",
  "kaspa",
  "monero",
  "ethereum-classic",
  "hedera-hashgraph",
  "okb",
  "vechain",
  "lido-dao",
  "arbitrum",
  "render-token",
  "the-graph",
  "injective-protocol",
  "quant-network",
  "maker",
  "fantom",
  "algorand",
  "elrond-erd-2",
  "aave",
  "eos",
  "theta-token",
  "tezos",
  "immutable-x",
  "axie-infinity",
  "iota",
  "flow",
  "zcash",
  "neo",
  "waves",
  "chiliz",
  "curve-dao-token",
  "basic-attention-token",
  "decentraland",
  "gala",
  "helium",
  "harmony",
  "oasis-network",
  "enjincoin",
  "1inch",
  "bittorrent",
  "compound-governance-token",
  "zcash",
  "terra-luna",
  "terrausd",
  "sushi",
  "mina-protocol",
  "arweave",
  "quantstamp",
  "amp-token",
  "ocean-protocol",
  "ravencoin",
  "celo",
  "ankr",
  "nxm",
  "balancer",
  "keep-network",
  "skale",
  "ren",
  "nervos-network",
  "livepeer",
  "hive",
  "origin-protocol",
  "numeraire",
  "trust-wallet-token",
  "storj",
  "uma",
  "ark",
  "fetch-ai",
  "mask-network",
  "cortex",
  "iotex",
  "api3",
  "pluton",
  "metis-token",
  "illuvium",
  "cartesi",
  "badger-dao",
];

async function fetchCryptoData() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${topCryptos.join(
        ","
      )}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allCryptos = data;
    filteredCryptos = data;

    displayCryptos(filteredCryptos);
    updateLastUpdatedTime();
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

function displayCryptos(cryptos) {
  if (cryptos.length === 0) {
    cryptoGrid.innerHTML =
      '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">No cryptocurrencies found matching your search.</div>';
    return;
  }

  cryptoGrid.innerHTML = cryptos
    .map((crypto) => {
      const priceChange24h = crypto.price_change_percentage_24h || 0;
      const priceChange7d = crypto.price_change_percentage_7d || 0;
      const priceChange1h = crypto.price_change_percentage_1h_in_currency || 0;

      return `
        <div class="crypto-card">
          <div class="crypto-header">
            <div class="crypto-info">
              <img src="${crypto.image}" alt="${
        crypto.name
      }" class="crypto-icon">
              <div>
                <div class="crypto-name">${crypto.name}</div>
                <div class="crypto-symbol">${crypto.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div class="crypto-rank">#${crypto.market_cap_rank || "N/A"}</div>
          </div>
          
          <div class="crypto-price">$${formatPrice(crypto.current_price)}</div>
          
          <div class="market-cap">
            Market Cap: $${formatLargeNumber(crypto.market_cap)}
          </div>
          
          <div class="crypto-changes">
            <div class="change-item">
              <div class="change-label">1H</div>
              <div class="change-value ${getChangeClass(priceChange1h)}">
                ${formatPercentage(priceChange1h)}
              </div>
            </div>
            <div class="change-item">
              <div class="change-label">24H</div>
              <div class="change-value ${getChangeClass(priceChange24h)}">
                ${formatPercentage(priceChange24h)}
              </div>
            </div>
            <div class="change-item">
              <div class="change-label">7D</div>
              <div class="change-value ${getChangeClass(priceChange7d)}">
                ${formatPercentage(priceChange7d)}
              </div>
            </div>
            <div class="change-item">
              <div class="change-label">Volume 24H</div>
              <div class="change-value neutral">
                $${formatLargeNumber(crypto.total_volume)}
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function formatPrice(price) {
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return price.toFixed(6);
  }
}

function formatLargeNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  return num.toLocaleString();
}

function formatPercentage(percentage) {
  if (percentage === null || percentage === undefined) return "N/A";
  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage.toFixed(2)}%`;
}

function getChangeClass(percentage) {
  if (percentage > 0) return "positive";
  if (percentage < 0) return "negative";
  return "neutral";
}

function updateLastUpdatedTime() {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function filterCryptos(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    filteredCryptos = allCryptos;
  } else {
    filteredCryptos = allCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(term) ||
        crypto.symbol.toLowerCase().includes(term)
    );
  }

  displayCryptos(filteredCryptos);
}

// Event listeners
refreshBtn.addEventListener("click", fetchCryptoData);
searchInput.addEventListener("input", (e) => {
  filterCryptos(e.target.value);
});

fetchCryptoData();
