export async function POST(req: Request): Promise<Response> {
    try {
      const body: { name: string; fileUrl: string } = await req.json();
  
      // You can add your upload logic here
      return new Response("Upload successful", { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Response(error.message, { status: 500 });
      }
      return new Response("Unknown error", { status: 500 });
    }
  }
  