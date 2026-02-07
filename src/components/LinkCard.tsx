import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface LinkCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
}

const LinkCard = ({ icon: Icon, title, subtitle, href, onClick }: LinkCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href || "#"}
      onClick={handleClick}
      target={onClick ? undefined : "_blank"}
      rel={onClick ? undefined : "noopener noreferrer"}
      className="link-card flex items-center gap-4 group w-full cursor-pointer"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm md:text-base">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
      <ChevronRight
        size={18}
        className="flex-shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
      />
    </a>
  );
};

export default LinkCard;
