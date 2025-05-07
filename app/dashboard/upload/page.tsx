import dynamic from "next/dynamic";

// ✅ Client-only render to avoid useSession crash
const UploadPage = dynamic(() => import("./UploadForm"), { ssr: false });

export default function UploadWrapper() {
  return <UploadPage />;
}
