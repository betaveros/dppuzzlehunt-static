<script>
let data = [{
	name: "Round 1: Finding Friends",
	puzzles: [
[ 0,  2, "puzzle/now-i-know.html", "Now I Know..."],
[ 0,  2, "puzzle/bottom-lines.html", "Bottom Lines"],
[ 0,  2, "puzzle/top-down-processing.html", "Top-Down Processing"],
[ 0,  2, "puzzle/petal-path.html", "Petal Path"],
[ 2,  2, "puzzle/cipher-salad.html", "Cipher Salad"],
[ 4,  2, "puzzle/streamlined.html", "Streamlined"],
[ 8, 10, "puzzle/finding-friends.html", "META: Finding Friends"],
]}, {
	name: "Round 2: Finding Myself",
	puzzles: [
[18,  4, "puzzle/sleep-talk.html", "Sleep Talk"],
[18,  4, "puzzle/greek-figures.html", "Greek Figures"],
[18,  4, "puzzle/danger.html", "Danger!"],
[20,  4, "puzzle/oodles-of-doodles.html", "Oodles of Doodles"],
[22,  4, "puzzle/geocaching.html", "Geocaching"],
[25,  4, "puzzle/smash-biros.html", "Smash Biros"],
[28,  4, "puzzle/demons-and-deductions.html", "Demons and Deductions"],
[31,  4, "puzzle/a-fork-in-the-road.html", "A Fork in the Road"],
[34,  4, "puzzle/fill-in-for-me.html", "Fill In For ME"],
[37,  4, "puzzle/multilingual.html", "Multilingual"],
[40,  4, "puzzle/nought-but-a-crossover.html", "Nought But a Crossover"],
[43,  4, "puzzle/the-magic-match.html", "The Magic Match"],
[46,  4, "puzzle/six-of-one-half-a-dozen-of-the-other.html", "Six of One, Half a Dozen of the Other"],
[49,  4, "puzzle/deity-duos.html", "Deity Duos"],
[52,  4, "puzzle/downright-cryptic.html", "Downright Cryptic"],
[55,  4, "puzzle/21st-century-celluloid-man.html", "21st Century Celluloid Man"],
[58,  4, "puzzle/play-on-words.html", "Play On Words"],
[74, 10, "puzzle/finding-myself.html", "META: Finding Myself"],
]}
];
let rounds = data.map(round => ({
	name: round.name,
	puzzles: round.puzzles.map(puzzle => {
	  let [threshold, value, url, name] = puzzle;
	  return {threshold, value, url, name, solved: false};
  }),
}));
try {
	let stored = JSON.parse(localStorage.getItem("simulator-solved"));
	if (stored) {
		stored.forEach((r, ri) => {
			r.forEach((p, pi) => {
				rounds[ri].puzzles[pi].solved = Boolean(p);
			});
		});
	}
} catch (e) {
	console.error(e);
}
	
function compute(rounds) {
	let unlockedPuzzles = [], spark = 0, storage = [];
	for (let round of rounds) {
		let ur = [], sr = [], next = null;
		let anyUnlocked = false;
		for (let puzzle of round.puzzles) {
			let unlocked = spark >= puzzle.threshold;
			anyUnlocked = anyUnlocked || unlocked;
			ur.push({...puzzle, unlocked});
			sr.push(puzzle.solved);
			if (unlocked && puzzle.solved) spark += puzzle.value;
			if (!unlocked && next === null) {
				next = puzzle;
			}
		}
		unlockedPuzzles.push({name: round.name, puzzles: ur, next, anyUnlocked});
		storage.push(sr);
	}
	try {
		localStorage.setItem("simulator-solved", JSON.stringify(storage));
	} catch (e) {
		console.error(e);
	}
	return {unlocked: unlockedPuzzles, spark};
}
$: res = compute(rounds);
</script>
<div class="spark">You currently have {res.spark} ✨.</div>
{#each res.unlocked as round, ri}
{#if round.anyUnlocked}
	<h4>{round.name}</h4>
	<table class="gph-list-table">
	<tr><th>Puzzle</th><th>Solved?</th><th>✨ Value</th></tr>
	{#each round.puzzles as puzzle, pi}
	<tr style:visibility={puzzle.unlocked ? "visible" : "collapse"}>
		  <td><a href="{puzzle.url}">{puzzle.name}</a></td>
		  <td><input type="checkbox" bind:checked={rounds[ri].puzzles[pi].solved}></td>
		  <td>{puzzle.value}</td>
	</tr>
	{/each}
	{#if round.next}
	<tr><td colspan="3" class="threshold">{#if round.next.name.startsWith("META")}Meta{:else}Next puzzle{/if} unlocks at {round.next.threshold} ✨</td></tr>
	{/if}
	</table>
{/if}
{/each}
