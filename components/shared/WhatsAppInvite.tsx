import { FaWhatsapp } from "react-icons/fa6";
import { WA_NUMBER } from "@/lib/constants";

interface WhatsAppInviteProps {
  number?: string;
  label?: string;
  className?: string;
}

export default function WhatsAppInvite({
  number = WA_NUMBER,
  label = "Message us on WhatsApp",
  className = "btn-whatsapp",
}: WhatsAppInviteProps) {
  const digits = number.replace(/[^0-9]/g, "");
  const waPhone = digits.startsWith("0") ? "254" + digits.slice(1) : digits;
  const whatsappUrl = `https://wa.me/${waPhone}?text=Hello%20Asriel%20Radio%2024%2F7%2C%20I%20am%20listening%20live!`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
    >
      <FaWhatsapp style={{ fontSize: "1.15em" }} />
      <span>{label}</span>
    </a>
  );
}
