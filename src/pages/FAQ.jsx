import { useState } from "react";

const groups = [
  {
    title: "Ordering and payment",
    questions: [
      ["What payment methods do you accept?", "We accept major credit cards, PayPal, and Apple Pay. Transactions are processed securely."],
      ["Can I modify or cancel my order?", "You can request changes shortly after placing the order. Use the contact page with your order details and we will help where possible."],
    ],
  },
  {
    title: "Shipping and delivery",
    questions: [
      ["How long does shipping take?", "Standard delivery usually takes 3 to 5 business days, depending on destination and order timing."],
      ["Do you offer international shipping?", "Yes. Delivery times and customs handling can vary based on the destination country."],
    ],
  },
  {
    title: "Returns and exchanges",
    questions: [
      ["What is your return policy?", "Unused items in original condition can be reviewed for return eligibility. Contact support for the latest process."],
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState("");

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <p className="faq-pill">Support center</p>
        <h1>Frequently asked questions in a<br />cleaner, more premium layout.</h1>
        <p>The FAQ now feels more editorial and easier to scan, with an accordion that works cleanly on the refreshed design.</p>
      </section>

      <div className="faq-groups">
        {groups.map((group, groupIndex) => (
          <section className="faq-group" key={group.title}>
            <p className="faq-group-title">{group.title}</p>
            <div className="faq-list">
              {group.questions.map(([question, answer], questionIndex) => {
                const id = `${groupIndex}-${questionIndex}`;
                const expanded = open === id;
                return (
                  <div className={`faq-row ${expanded ? "is-open" : ""}`} key={question}>
                    <button type="button" onClick={() => setOpen(expanded ? "" : id)} aria-expanded={expanded}>
                      <span>{question}</span>
                      <i aria-hidden="true" />
                    </button>
                    <div className="faq-answer" aria-hidden={!expanded}>
                      <p>{answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
