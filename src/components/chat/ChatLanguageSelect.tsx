import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Language } from "@/hooks/useChatSession";
import { Globe } from "lucide-react";

interface ChatLanguageSelectProps {
  value: Language;
  onValueChange: (value: Language) => void;
}

export function ChatLanguageSelect({ value, onValueChange }: ChatLanguageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="dutch">Dutch</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
