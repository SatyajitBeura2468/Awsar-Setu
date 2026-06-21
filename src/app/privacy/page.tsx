export default function Page() {
  return (
    <article className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-white p-6 shadow-soft md:p-10">
      <h1 className="text-3xl font-black tracking-tight text-ink md:text-5xl">
        Privacy Policy
      </h1>
      <div className="mt-6 grid gap-6 text-base leading-8 text-slate">
        <p>
          AwsarSetu is browse-first. You can search opportunities and open
          official-source links without creating an account.
        </p>
        <p>
          If you sign in, we store only lightweight profile preferences needed
          for matching: state, age or age range, education level, current role,
          interests, optional gender and optional income range. We do not ask
          for Aadhaar number, bank details, caste certificate details,
          disability records, detailed medical data or exact date of birth.
        </p>
        <p>
          Saved opportunities, notes, reminders and notification preferences are
          private to your account through database row-level security. Guests
          can save locally on their device.
        </p>
        <p lang="hi">
          AwsarSetu पहले ब्राउज़ करने वाला अनुभव है। खाता बनाए बिना आप अवसर
          खोज सकते हैं और आधिकारिक स्रोत खोल सकते हैं। साइन इन करने पर केवल
          हल्की प्रोफ़ाइल पसंदें सहेजी जाती हैं, जैसे राज्य, आयु, शिक्षा,
          भूमिका और रुचियां।
        </p>
      </div>
    </article>
  );
}
