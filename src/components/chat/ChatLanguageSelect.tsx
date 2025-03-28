import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Language } from "@/hooks/useChatSession";

interface ChatLanguageSelectProps {
	value: Language;
	onValueChange: (value: Language) => void;
}

export function ChatLanguageSelect({
	value,
	onValueChange,
}: ChatLanguageSelectProps) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="w-[140px]">
				<SelectValue>{value === "english" ? "English" : "Dutch"}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="english">English</SelectItem>
					<SelectItem value="dutch">Dutch</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
