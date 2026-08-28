// 注意：这里必须用 @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ 把这里换成你现在正在用的那个 Key
const apiKey = "REDACTED_ROTATE_THIS_KEY";

const genAI = new GoogleGenerativeAI(apiKey);

async function check() {
  try {
    console.log("正在询问 Google 服务器...");
    // 获取当前 Key 可用的所有模型列表
    const modelInstance = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // 注意：SDK 没有直接的 listModels 方法暴露在根对象，我们需要用 fetch 或者简单的测试
    // 但我们可以利用报错信息，或者直接测试最基础的连接
    
    // 我们尝试直接请求一个极简单的生成，如果 Key 没问题，至少会有反应
    const result = await modelInstance.generateContent("Test");
    console.log("✅ 通了！gemini-1.5-flash 可以用！");
    
  } catch (error) {
    console.log("\n❌ 发生错误:");
    console.log(error.message);
    
    if (error.message.includes("API key not valid")) {
      console.log("👉 结论：API Key 无效，请重新复制或重新申请。");
    } else if (error.message.includes("404")) {
      console.log("👉 结论：模型名字不对，或者 Key 绑定的项目没有开启 'Generative Language API' 权限。");
    }
  }
}

check();