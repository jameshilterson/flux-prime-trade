import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, UserPlus, ArrowDownToLine } from "lucide-react";

const NAMES = ["John", "Peter", "Michael", "Sofia", "Aisha", "Yuki", "Liam", "Marcus", "Elena", "Carlos", "Priya", "Amara"];
const COUNTRIES = ["Italy", "Canada", "UAE", "Japan", "Germany", "Brazil", "Singapore", "France", "Spain", "Australia"];
const ACTIONS = [
  { type: "earned", icon: DollarSign, color: "text-success", verb: "just earned" },
  { type: "withdrew", icon: ArrowDownToLine, color: "text-gold", verb: "withdrew" },
  { type: "deposit", icon: TrendingUp, color: "text-gold", verb: "deposited" },
  { type: "joined", icon: UserPlus, color: "text-success", verb: "joined from", isJoin: true },
];

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export const LiveEarningsPopup = () => {
  const [item, setItem] = useState<{ id: number; text: string; Icon: typeof DollarSign; color: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const action = rand(ACTIONS);
      const name = rand(NAMES);
      const country = rand(COUNTRIES);
      const amount = (Math.floor(Math.random() * 90) + 5) * 1000;
      const text = action.isJoin
        ? `New investor ${action.verb} ${country}`
        : `${name} from ${country} ${action.verb} $${amount.toLocaleString()}`;
      setItem({ id: Date.now(), text, Icon: action.icon, color: action.color });
      setTimeout(() => setItem(null), 5000);
    };
    const initial = setTimeout(tick, 2500);
    const interval = setInterval(tick, 8000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!item) return null;
  return (
    <div key={item.id} className="fixed bottom-6 left-6 z-50 animate-float-up">
      <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-card/95 backdrop-blur-xl p-3 pr-5 shadow-elegant max-w-[320px]">
        <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${item.color}`}>
          <item.Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium">{item.text}</p>
      </div>
    </div>
  );
};