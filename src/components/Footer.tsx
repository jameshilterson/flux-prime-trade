export const Footer = () => (
  <footer className="border-t border-border/40 bg-card/30 py-12 mt-12">
    <div className="container grid md:grid-cols-4 gap-8 text-sm">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center font-black text-midnight">C</div>
          <span className="font-bold text-lg">CryptoVault</span>
        </div>
        <p className="text-muted-foreground">Smart crypto mining, AI trading & copy trading platform.</p>
      </div>
      {[
        { title: "Platform", links: ["Dashboard", "Plans", "Copy Trading", "Calculator"] },
        { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
        { title: "Legal", links: ["Terms", "Privacy", "AML/KYC", "Risk Disclosure"] },
      ].map(s => (
        <div key={s.title}>
          <h4 className="font-semibold mb-3">{s.title}</h4>
          <ul className="space-y-2 text-muted-foreground">
            {s.links.map(l => <li key={l}><a href="#" className="hover:text-gold transition">{l}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground text-center">
      © {new Date().getFullYear()} CryptoVault. All rights reserved. Crypto investments are subject to market risk.
    </div>
  </footer>
);