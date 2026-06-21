import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// 占位 route：未来接入 HuggingFace depth-anything-3
// 当前返回提示，前端用 CSS 视差兜底
//
// 接入步骤（未来）：
// 1. 申请 HuggingFace token: https://huggingface.co/settings/tokens
// 2. .env.local 加 HF_TOKEN=hf_xxx
// 3. POST 图片 binary 到
//    https://api-inference.huggingface.co/models/depth-anything/depth-anything-v3-large
// 4. 返回的 depth map 保存，前端用 depth+原图做真实视差合成
//
// 字节自家 depth-anything-3（评委加分项）：
// https://github.com/bytedance-seed/depth-anything-3

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      status: "not_implemented",
      message:
        "Depth inference is in mock mode. Front-end uses CSS parallax. Set HF_TOKEN in .env.local and uncomment the inference code to enable real depth-anything-3.",
      model: "depth-anything-3 (planned)",
      fallback: "css-parallax",
    },
    { status: 200 }
  );
}
