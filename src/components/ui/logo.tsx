import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/brand/awsarsetu-logo.svg"
        alt=""
        width={42}
        height={42}
        priority
        className="h-10 w-10"
      />
      {!compact && (
        <div className="leading-none">
          <p className="text-lg font-black tracking-tight text-ink">
            AwsarSetu
          </p>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate">
            Opportunity bridge
          </p>
        </div>
      )}
    </div>
  );
}
