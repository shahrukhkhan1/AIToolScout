import { createServer } from "../server";

let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      cachedApp = await createServer();
    }
    return cachedApp(req, res);
  } catch (error) {
    console.error("Vercel API Handler Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: error instanceof Error ? error.message : String(error) 
    });
  }
}
