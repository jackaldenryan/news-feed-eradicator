import { Show, type ParentComponent } from "solid-js";
import type { SnoozeMode } from "/storage/schema";
import { useOptionsPageState } from "../../state";
import { saveSnoozeMode, saveTypingLockEnabled, saveTypingLockCharCount } from "/storage/storage";
import { LockedSettingsOverlay, SettingsLockFooter } from "../../lock";

const SnoozeModeOption: ParentComponent<{ mode: SnoozeMode, title: string }> = ({ mode, title, children }) => {
	const state = useOptionsPageState();

	const onClick = async () => {
		await saveSnoozeMode(mode);
		state.snoozeMode.refetch();
	}

	return <li class="bg-darken-100 rounded">
		<label class={`block p-4 space-y-2 cursor-pointer ${state.snoozeMode.get() === mode ? 'outlined' : 'hoverable'}`}>
			<div class="flex gap-1">
				<input type="radio" class="radio" name="snooze-mode" disabled={state.settingsLockedDown()} checked={state.snoozeMode.get() === mode} onClick={onClick} />
				<div class="space-y-1">
					<span class="flex-1">{ title }</span>
					<div class="text-secondary font-sm ml-4">
						{ children }
					</div>
				</div>
			</div>
		</label>
	</li>
}

const TypingLockSettings = () => {
	const state = useOptionsPageState();

	const onToggle = async () => {
		const newValue = !state.typingLockEnabled.get();
		await saveTypingLockEnabled(newValue);
		state.typingLockEnabled.refetch();
	};

	const onCharCountChange = async (e: Event) => {
		const value = parseInt((e.target as HTMLInputElement).value, 10);
		if (value >= 10 && value <= 500) {
			await saveTypingLockCharCount(value);
			state.typingLockCharCount.refetch();
		}
	};

	return (
		<div class="space-y-3">
			<div class="font-lg">Typing Lock</div>
			<div class="text-secondary font-sm">
				Require typing random words before you can snooze. This adds friction to make snoozing more intentional.
			</div>

			<label class="flex gap-2 cross-center cursor-pointer">
				<input
					type="checkbox"
					class="toggle"
					checked={state.typingLockEnabled.get() ?? false}
					onChange={onToggle}
					disabled={state.settingsLockedDown()}
				/>
				<span>Enable typing lock</span>
			</label>

			<Show when={state.typingLockEnabled.get()}>
				<div class="flex gap-2 cross-center pl-6">
					<label class="text-secondary">Characters required:</label>
					<input
						type="number"
						class="p-1 rounded b-1"
						style="width: 80px;"
						min={10}
						max={500}
						value={state.typingLockCharCount.get() ?? 50}
						onChange={onCharCountChange}
						disabled={state.settingsLockedDown()}
					/>
					<span class="text-secondary font-sm">(10-500)</span>
				</div>
			</Show>
		</div>
	);
};

export const SnoozeTabContent = () => {
	const state = useOptionsPageState();

	return (
		<div>
			<div class="p-4 space-y-4 overlay-container">
				<ul class="space-y-2 z1 blur-disabled" aria-disabled={state.settingsLockedDown()}>
					<SnoozeModeOption mode="hold" title="Hold to snooze">
						Requires you to hold the snooze button down for a while to start snoozing. The longer you hold, the longer the snooze.
					</SnoozeModeOption>

					<SnoozeModeOption mode="instant" title="Instant snooze">
						Not worried about your self-control? With this option you can just hit a button to start snoozing instantly.
					</SnoozeModeOption>
				</ul>

				<hr class="b-darken-100" />

				<div class="z1 blur-disabled" aria-disabled={state.settingsLockedDown()}>
					<TypingLockSettings />
				</div>

				<LockedSettingsOverlay />
			</div>
			<SettingsLockFooter />
		</div>
	);
};
