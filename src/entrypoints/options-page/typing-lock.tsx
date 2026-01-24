import { createSignal, createMemo, onMount } from "solid-js";
import { useOptionsPageState } from "./state";

// Word list for random generation
const WORD_LIST = [
	'apple', 'banana', 'orange', 'grape', 'lemon', 'cherry', 'peach', 'mango',
	'table', 'chair', 'window', 'door', 'floor', 'wall', 'roof', 'garden',
	'river', 'ocean', 'mountain', 'forest', 'desert', 'island', 'valley', 'cloud',
	'happy', 'brave', 'quiet', 'bright', 'smooth', 'sharp', 'gentle', 'swift',
	'dance', 'sing', 'write', 'think', 'dream', 'build', 'plant', 'watch',
	'summer', 'winter', 'spring', 'autumn', 'morning', 'evening', 'night', 'sunset',
	'coffee', 'bread', 'cheese', 'butter', 'honey', 'sugar', 'water', 'juice',
	'laptop', 'phone', 'camera', 'piano', 'guitar', 'violin', 'flute', 'drum',
	'tiger', 'eagle', 'whale', 'rabbit', 'turtle', 'dolphin', 'falcon', 'penguin',
	'silver', 'golden', 'purple', 'orange', 'yellow', 'green', 'blue', 'pink',
	'pocket', 'basket', 'blanket', 'pillow', 'mirror', 'candle', 'flower', 'feather',
	'travel', 'explore', 'discover', 'create', 'design', 'focus', 'relax', 'enjoy'
];

function generateRandomWords(targetCharCount: number): string {
	const words: string[] = [];
	let totalLength = 0;

	while (totalLength < targetCharCount) {
		const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
		words.push(word);
		// Add word length plus space (except for first word)
		totalLength += word.length + (words.length > 1 ? 1 : 0);
	}

	return words.join(' ');
}

export const TypingLock = () => {
	const state = useOptionsPageState();

	const [targetString, setTargetString] = createSignal<string>('');
	const [inputValue, setInputValue] = createSignal<string>('');

	// Generate target string on mount
	onMount(() => {
		const charCount = state.typingLockCharCount.get() ?? 50;
		setTargetString(generateRandomWords(charCount));
	});

	// Calculate progress (consecutive correct characters from start)
	const progress = createMemo(() => {
		const target = targetString();
		const input = inputValue();
		if (target.length === 0) return 0;

		let correctCount = 0;
		for (let i = 0; i < input.length && i < target.length; i++) {
			if (input[i] === target[i]) correctCount++;
			else break;
		}
		return Math.round((correctCount / target.length) * 100);
	});

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setInputValue(value);

		if (value === targetString()) {
			state.typingLockCompleted.set(true);
		}
	};

	return (
		<div class="card outlined shadow p-4 space-y-4" style="max-width: 500px; margin: 0 auto;">
			<div class="text-center space-y-1">
				<div class="font-lg">Type to unlock snooze</div>
				<div class="text-secondary font-sm">
					Type the words below exactly to access snooze buttons
				</div>
			</div>

			{/* Target string display */}
			<div
				class="p-3 bg-darken-100 rounded font-sm"
				style="font-family: monospace; word-break: break-all; line-height: 1.6; user-select: none;"
			>
				{targetString()}
			</div>

			{/* Progress bar */}
			<div
				class="overlay-container"
				style="height: 8px; background: var(--theme-darken-100); border-radius: 4px; overflow: hidden;"
			>
				<div
					class="bg-accent"
					style={`width: ${progress()}%; height: 100%; border-radius: 4px; transition: width 0.1s;`}
				/>
			</div>

			{/* Input field */}
			<div>
				<input
					type="text"
					class="w-full p-2 rounded b-1"
					style="font-family: monospace;"
					placeholder="Start typing..."
					value={inputValue()}
					onInput={onInput}
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
				/>
			</div>

			<div class="text-center text-secondary font-sm">
				{progress()}% complete ({inputValue().length} / {targetString().length} characters)
			</div>
		</div>
	);
};
