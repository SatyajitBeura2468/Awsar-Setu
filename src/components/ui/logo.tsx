import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <Image
        src="/brand/awsarsetu-logo.svg"
        alt=""
        width={42}
        height={42}
        priority
        className="brand-mark"
      />
      {!compact && (
        <div className="brand-copy">
          <p>AwsarSetu</p>
          <span>Opportunity navigation</span>
        </div>
      )}
    </div>
  );
}
