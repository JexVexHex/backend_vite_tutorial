(function(){
	const storageKeys = {
		steps: 'tutorial.steps',
		quizzes: 'tutorial.quizzes',
		problems: 'tutorial.problems',
		dark: 'tutorial.light' // store light mode state
	};

	const stepCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"][data-done]'));
	const quizzes = Array.from(document.querySelectorAll('.quiz'));
	const problems = Array.from(document.querySelectorAll('.problem'));
	const checklistEl = document.getElementById('checklist');
	const progressBar = document.getElementById('progressBar');
	const resetBtn = document.getElementById('resetProgress');
	const darkToggle = document.getElementById('darkModeToggle');

	function loadState(){
		try{
			return {
				steps: JSON.parse(localStorage.getItem(storageKeys.steps) || '{}'),
				quizzes: JSON.parse(localStorage.getItem(storageKeys.quizzes) || '{}'),
				problems: JSON.parse(localStorage.getItem(storageKeys.problems) || '{}'),
				light: JSON.parse(localStorage.getItem(storageKeys.dark) || 'false')
			};
		}catch{ return { steps:{}, quizzes:{}, problems:{}, light:false }; }
	}
	function saveState(state){
		localStorage.setItem(storageKeys.steps, JSON.stringify(state.steps));
		localStorage.setItem(storageKeys.quizzes, JSON.stringify(state.quizzes));
		localStorage.setItem(storageKeys.problems, JSON.stringify(state.problems));
		localStorage.setItem(storageKeys.dark, JSON.stringify(state.light));
	}

	let state = loadState();

	function applyTheme(){
		if(state.light){ document.documentElement.classList.add('light'); }
		else { document.documentElement.classList.remove('light'); }
	}
	darkToggle.addEventListener('click', () => { state.light = !state.light; applyTheme(); saveState(state); });
	applyTheme();

	// Initialize steps
	stepCheckboxes.forEach(cb => {
		const id = cb.dataset.done;
		cb.checked = Boolean(state.steps[id]);
		cb.addEventListener('change', () => {
			state.steps[id] = cb.checked;
			saveState(state);
			updateProgress();
			renderChecklist();
		});
	});

	function renderChecklist(){
		if(!checklistEl) return;
		checklistEl.innerHTML = '';
		stepCheckboxes.forEach(cb => {
			const id = cb.dataset.done;
			const section = cb.closest('[data-step-id]');
			const title = section?.querySelector('.card-header h2')?.textContent || id;
			const li = document.createElement('li');
			li.innerHTML = `${cb.checked ? '✅' : '⬜️'} <span>${title}</span>`;
			checklistEl.appendChild(li);
		});
	}
	renderChecklist();

	// Quizzes
	quizzes.forEach(q => {
		const id = q.dataset.quizId;
		const form = q.querySelector('form');
		const resultEl = q.querySelector('.quiz-result');
		if(state.quizzes[id]){
			const saved = state.quizzes[id];
			const input = form.querySelector(`input[value="${CSS.escape(saved)}"]`);
			if(input){ input.checked = true; }
			resultEl.textContent = '✅ Correct previously';
			resultEl.className = 'quiz-result ok';
		}
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const selected = form.querySelector('input[type="radio"]:checked');
			if(!selected){
				resultEl.textContent = 'Select an option first.';
				resultEl.className = 'quiz-result no';
				return;
			}
			const correct = selected.hasAttribute('data-correct');
			if(correct){
				resultEl.textContent = '✅ Correct!';
				resultEl.className = 'quiz-result ok';
				state.quizzes[id] = selected.value;
				saveState(state);
				updateProgress();
			}else{
				resultEl.textContent = '❌ Not quite. Try again!';
				resultEl.className = 'quiz-result no';
			}
		});
	});

	// Problems (short answer)
	problems.forEach(p => {
		const id = p.dataset.problemId;
		const form = p.querySelector('form');
		const input = p.querySelector('input[name="answer"]');
		const resultEl = p.querySelector('.problem-result');
		const expected = (resultEl?.dataset?.expected || '').trim();
		if(state.problems[id]){
			input.value = state.problems[id];
			if(input.value.trim() === expected){
				resultEl.textContent = '✅ Correct previously';
				resultEl.className = 'problem-result ok';
			}
		}
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const answer = (input.value || '').trim();
			if(!answer){
				resultEl.textContent = 'Please enter an answer.';
				resultEl.className = 'problem-result no';
				return;
			}
			state.problems[id] = answer;
			saveState(state);
			if(answer === expected){
				resultEl.textContent = '✅ Correct!';
				resultEl.className = 'problem-result ok';
				updateProgress();
			}else{
				resultEl.textContent = '❌ Not quite. Check the steps above and try again.';
				resultEl.className = 'problem-result no';
			}
		});
	});

	// Copy buttons
	Array.from(document.querySelectorAll('.copy[data-copy]')).forEach(btn => {
		btn.addEventListener('click', async () => {
			const sel = btn.dataset.copy;
			const el = document.querySelector(sel);
			if(!el) return;
			try{
				await navigator.clipboard.writeText(el.innerText);
				btn.textContent = 'Copied!';
				setTimeout(() => btn.textContent = 'Copy', 1200);
			}catch{
				btn.textContent = 'Copy failed';
				setTimeout(() => btn.textContent = 'Copy', 1200);
			}
		});
	});

	function counts(){
		const totalSteps = stepCheckboxes.length;
		const stepsDone = stepCheckboxes.filter(cb => cb.checked).length;
		const totalQuizzes = quizzes.length;
		const quizzesDone = quizzes.filter(q => state.quizzes[q.dataset.quizId]).length;
		const totalProblems = problems.length;
		const problemsDone = problems.filter(p => {
			const id = p.dataset.problemId;
			const expected = p.querySelector('.problem-result')?.dataset?.expected || '';
			return (state.problems[id] || '').trim() === expected.trim();
		}).length;
		return {
			total: totalSteps + totalQuizzes + totalProblems,
			done: stepsDone + quizzesDone + problemsDone
		};
	}

	function updateProgress(){
		const { total, done } = counts();
		const pct = total ? Math.round((done / total) * 100) : 0;
		progressBar.style.width = pct + '%';
		progressBar.setAttribute('aria-valuenow', String(pct));
		progressBar.title = pct + '% complete';
	}
	updateProgress();

	resetBtn.addEventListener('click', () => {
		if(!confirm('Reset all progress?')) return;
		state = { steps:{}, quizzes:{}, problems:{}, light: state.light };
		saveState(state);
		// reset UI
		stepCheckboxes.forEach(cb => cb.checked = false);
		quizzes.forEach(q => {
			const form = q.querySelector('form');
			form.reset();
			const resultEl = q.querySelector('.quiz-result');
			resultEl.textContent = '';
			resultEl.className = 'quiz-result';
		});
		problems.forEach(p => {
			const form = p.querySelector('form');
			const resultEl = p.querySelector('.problem-result');
			form.reset();
			resultEl.textContent = '';
			resultEl.className = 'problem-result';
		});
		renderChecklist();
		updateProgress();
	});

	// Smooth anchor scrolling
	Array.from(document.querySelectorAll('a[href^="#"]')).forEach(a => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const id = a.getAttribute('href');
			const target = document.querySelector(id);
			if(target){ target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
		});
	});
})();
