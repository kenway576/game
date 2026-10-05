# 生图环境：Key 从调用方的环境变量来，这里只锁 Vertex
export PATH="/c/Users/adm/node-portable/node-v24.19.0-win-x64:$PATH"
export GEMINI_BACKEND=vertex GEMINI_REQUIRE_VERTEX=1
# 走 global 端点：默认分到的区域画图模型老是 429
export GEMINI_VERTEX_PROJECT=389812341416 GEMINI_VERTEX_LOCATION=global
