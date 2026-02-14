import { createSignal, Show } from "solid-js";
import { useOptionsPageState } from "./state";
import { TypingLock } from "./typing-lock";

export const GlobalLockBar = () => {
	const state = useOptionsPageState();
	const [showChallenge, setShowChallenge] = createSignal(false);

	const onUnlockClick = () => {
		setShowChallenge(true);
	};

	const onChallengeComplete = () => {
		setShowChallenge(false);
		state.unlockSettings();
	};

	const onLockClick = () => {
		state.lockSettings();
	};

	const onDisableLock = () => {
		state.disableLock();
	};

	const onEnableLock = () => {
		state.lockSettings();
	};

	const onWordCountChange = (e: Event) => {
		const value = parseInt((e.target as HTMLInputElement).value, 10);
		if (!isNaN(value)) {
			state.setGlobalLockWordCount(value);
		}
	};

	return (
		<div>
			{/* Locked state: lock is enabled and user has not unlocked */}
			<Show when={state.isLocked() && !showChallenge()}>
				<div class="card shadow outlined p-4 flex gap-4 cross-center">
					<div class="flex-1 flex gap-2 cross-center">
						<span class="font-lg">🔒</span>
						<span>Settings are locked</span>
					</div>
					<button class="primary" onClick={onUnlockClick}>Unlock</button>
				</div>
			</Show>

			{/* Challenge active: user clicked Unlock, typing challenge shown */}
			<Show when={state.isLocked() && showChallenge()}>
				<div class="space-y-4">
					<TypingLock onComplete={onChallengeComplete} />
					<div class="text-center">
						<button class="tertiary font-sm" onClick={() => setShowChallenge(false)}>Cancel</button>
					</div>
				</div>
			</Show>

			{/* Unlocked state: lock is enabled in storage but user has temporary access */}
			<Show when={!state.isLocked() && state.globalLockEnabled.get() === true}>
				<div class="card shadow outlined p-4 space-y-3">
					<div class="flex gap-4 cross-center">
						<div class="flex-1 flex gap-2 cross-center">
							<span class="font-lg">🔓</span>
							<span>Settings unlocked</span>
						</div>
						<button class="primary" onClick={onLockClick}>Lock settings</button>
					</div>
					<div class="flex gap-4 cross-center">
						<label class="text-secondary font-sm">Words to type for unlock:</label>
						<input
							type="number"
							class="p-1 rounded b-1"
							style="width: 80px;"
							min={1}
							max={5000}
							value={state.globalLockWordCount.get() ?? 10}
							onChange={onWordCountChange}
						/>
						<span class="text-secondary font-sm">(1-5000)</span>
						<div class="flex-1" />
						<button class="tertiary font-sm" onClick={onDisableLock}>Disable lock</button>
					</div>
				</div>
			</Show>

			{/* Lock not enabled: show option to enable */}
			<Show when={state.globalLockEnabled.get() === false || state.globalLockEnabled.get() == null}>
				<div class="card shadow outlined p-4 flex gap-4 cross-center">
					<div class="flex-1 text-secondary">
						Lock your settings to prevent impulsive changes
					</div>
					<button class="secondary" onClick={onEnableLock}>Enable lock</button>
				</div>
			</Show>
		</div>
	);
};

export const LockedOverlay = () => {
	const state = useOptionsPageState();

	return (
		<Show when={state.isLocked()}>
			<div class="overlay flex cross-center axis-center">
				<div class="card shadow rounded p-4 text-center flex flex-col gap-2">
					<h3 class="font-xl">
						🔒 Settings locked
					</h3>
					<p class="text-secondary">
						Use the lock controls above to unlock settings
					</p>
				</div>
			</div>
		</Show>
	);
};
