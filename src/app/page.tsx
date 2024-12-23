import GiftUploadWrapper from "@/components/GiftUploadWrapper";
import RulesPanel from "@/components/RulesPanel";
import { SuccessNotification } from "@/components/SuccessNotification";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <main className="max-w-5xl mx-auto flex flex-col items-center gap-12 p-8 pt-16 relative">
          {/* 標題區塊 */}
          <div className="text-center space-y-6 float">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-7xl font-bold text-white mt-12 text-center drop-shadow-xl">
                聖誕<span className="text-red-500 hover:text-red-400 transition-colors">交換樂</span>
              </h1>
            </div>

            <p className="text-center text-white text-xl md:text-2xl max-w-2xl leading-relaxed drop-shadow-xl font-medium">
              分享你的聖誕驚喜，
              <br className="hidden md:block" />
              收穫來自陌生人的溫暖祝福！
            </p>
          </div>

          {/* 上傳表單 */}
          <div className="w-full max-w-md relative">
            <GiftUploadWrapper />
          </div>
        </main>
      </div>
      <RulesPanel />
      <SuccessNotification />
    </>
  );
}
