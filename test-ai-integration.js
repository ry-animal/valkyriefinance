// Test script for AI Engine integration with tRPC
const _testPortfolio = {
  totalValue: '25000.00',
  assets: [
    {
      symbol: 'ETH',
      balance: '8.5',
      valueUsd: '15000.00',
      percentage: 60.0,
    },
    {
      symbol: 'BTC',
      balance: '0.25',
      valueUsd: '10000.00',
      percentage: 40.0,
    },
  ],
  chainDistribution: {
    ethereum: '20000.00',
    arbitrum: '5000.00',
  },
};

const BASE_URL = 'http://localhost:3000';

async function makeRequest(path, data = null, isQuery = false) {
  const url = `${BASE_URL}/trpc/${path}`;

  try {
    let fetchUrl = url;
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (isQuery) {
      // For queries, use GET request
      options.method = 'GET';
      if (data) {
        // Add query parameters for input
        const params = new URLSearchParams();
        params.append('input', JSON.stringify(data));
        fetchUrl = `${url}?${params.toString()}`;
      }
    } else {
      // For mutations, use POST request
      options.method = 'POST';
      if (data) {
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(fetchUrl, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
    }

    return result;
  } catch (error) {
    return { error: { message: error.message } };
  }
}

async function testAIIntegration() {
  console.log('🧪 Testing AI Engine Integration with tRPC Server...\n');

  // Test 1: Check AI Engine Status (Query)
  console.log('📊 Test 1: Checking AI Engine Status');
  const statusResult = await makeRequest('ai.getAIEngineStatus', null, true);
  console.log('✅ AI Engine Status:', JSON.stringify(statusResult, null, 2));
  console.log('');

  // Test 2: Get Market Indicators (Query)
  console.log('📈 Test 2: Getting Market Indicators');
  const marketResult = await makeRequest('ai.getMarketIndicators', null, true);
  console.log('✅ Market Indicators:', JSON.stringify(marketResult, null, 2));
  console.log('');

  // Test 3: Advanced Portfolio Optimization (Mutation)
  console.log('🎯 Test 3: Advanced Portfolio Optimization');
  const samplePortfolio = {
    totalValue: '25000.00',
    assets: [
      {
        symbol: 'ETH',
        balance: '10.5',
        valueUsd: '15000.00',
        percentage: 60,
      },
      {
        symbol: 'BTC',
        balance: '0.25',
        valueUsd: '10000.00',
        percentage: 40,
      },
    ],
    chainDistribution: {
      ethereum: '15000.00',
      arbitrum: '10000.00',
    },
  };

  const optimizationResult = await makeRequest(
    'ai.optimizePortfolioAdvanced',
    samplePortfolio,
    false
  );
  console.log('✅ Advanced Optimization:', JSON.stringify(optimizationResult, null, 2));
  console.log('');

  // Test 4: Portfolio Risk Assessment (Mutation)
  console.log('⚠️  Test 4: Portfolio Risk Assessment');
  const riskResult = await makeRequest('ai.assessPortfolioRisk', samplePortfolio, false);
  console.log('✅ Risk Assessment:', JSON.stringify(riskResult, null, 2));
  console.log('');

  // Test 5: Token Analysis (Mutation)
  console.log('🔍 Test 5: Token Analysis');
  const tokenAnalysisData = {
    tokens: ['ETH', 'BTC'],
    timeframe: '1d',
  };

  const tokenResult = await makeRequest('ai.getTokenAnalysis', tokenAnalysisData, false);
  console.log('✅ Token Analysis:', JSON.stringify(tokenResult, null, 2));
  console.log('');

  console.log('🏁 AI Integration Testing Complete!');
}

// Run the tests
testAIIntegration().catch(console.error);
