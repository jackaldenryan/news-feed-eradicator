import { createSignal, createMemo, onMount } from "solid-js";
import { useOptionsPageState } from "./state";

export const WORD_LIST = [
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

export function generateRandomWords(wordCount: number): string {
	const words: string[] = [];
	for (let i = 0; i < wordCount; i++) {
		words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]!);
	}
	return words.join(' ');
}

export const TypingLock = (props: { onComplete: () => void }) => {
	const state = useOptionsPageState();

	const [targetString, setTargetString] = createSignal<string>('');
	const [inputValue, setInputValue] = createSignal<string>('');

	onMount(() => {
		const wordCount = state.globalLockWordCount.get() ?? 10;
		setTargetString(generateRandomWords(wordCount));
	});

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
		const el = e.target as HTMLTextAreaElement;
		setInputValue(el.value);

		// Auto-resize textarea to fit content
		el.style.height = 'auto';
		el.style.height = el.scrollHeight + 'px';

		if (el.value === targetString()) {
			props.onComplete();
		}
	};

	const wordCount = () => {
		const target = targetString();
		if (target.length === 0) return 0;
		return target.split(' ').length;
	};

	const wordsTyped = () => {
		const input = inputValue();
		if (input.length === 0) return 0;
		return input.split(' ').length;
	};

	return (
		<div class="card outlined shadow p-4 space-y-4" style="max-width: 600px; margin: 0 auto;">
			<div class="text-center space-y-1">
				<div class="font-lg">Type to unlock settings</div>
				<div class="text-secondary font-sm">
					Type the {wordCount()} words below exactly to unlock settings
				</div>
			</div>

			{/* Target string display */}
			<div
				class="p-3 bg-darken-100 rounded"
				style="font-family: monospace; font-size: 12px; word-break: break-word; line-height: 1.8; user-select: none; max-height: 300px; overflow-y: auto;"
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

			{/* Input field - textarea for auto-expanding */}
			<div>
				<textarea
					class="w-full p-2 rounded b-1"
					style="font-family: monospace; font-size: 12px; line-height: 1.8; resize: none; overflow: hidden; min-height: 38px;"
					placeholder="Start typing..."
					onInput={onInput}
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
					rows={1}
				>{inputValue()}</textarea>
			</div>

			<div class="text-center text-secondary font-sm">
				{progress()}% complete — {wordsTyped()} / {wordCount()} words ({inputValue().length} / {targetString().length} characters)
			</div>
		</div>
	);
};
