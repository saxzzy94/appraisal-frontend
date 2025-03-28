import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Language } from "@/hooks/useChatSession";

interface ChatLanguageSelectProps {
  value: Language;
  onValueChange: (value: Language) => void;
}

export function ChatLanguageSelect({ value, onValueChange }: ChatLanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {value === "en" ? "English" : "Dutch"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="nl">Dutch</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}