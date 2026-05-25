const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyArmZqM5E9axQS_hpGM5m8QGoBT_Ujbw_o');

async function testModels() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-pro'];
  
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'working'");
      console.log(`✅ ${modelName} - Working`);
    } catch (error) {
      console.log(`❌ ${modelName} - Failed: ${error.message}`);
    }
  }
}

testModels();