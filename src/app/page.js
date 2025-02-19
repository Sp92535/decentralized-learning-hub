import UploadButton from "@/components/UploadButton";
import ConnectWallet from "../components/ConnectWallet";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <ConnectWallet />
      <UploadButton />
    </div>
  );
}
