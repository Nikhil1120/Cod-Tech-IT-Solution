import { useMemo, useState } from 'react';
import { saveToStorage, loadFromStorage } from '../../lib/storage';

type Feedback = { stars: number; comment: string; anonymous: boolean; featureSuggestion?: string };

const STORAGE_KEY = 'rate-us-feedbacks';

export function RateUs() {
  const [stars, setStars] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [featureSuggestion, setFeatureSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const existing = useMemo<Feedback[]>(() => loadFromStorage(STORAGE_KEY, [] as Feedback[]), []);

  function submit() {
    const next: Feedback[] = [...existing, { stars, comment, anonymous, featureSuggestion: featureSuggestion || undefined }];
    saveToStorage(STORAGE_KEY, next);
    setSubmitted(true);
  }

  return (
    <div className="section">
      <h2>Rate Us</h2>

      <div className="card">
        <h3>Rate on App Store / Play Store</h3>
        <div className="actions">
          <a className="badge" href="https://play.google.com/store" target="_blank" rel="noreferrer">Open Play Store</a>
          <a className="badge" href="https://apps.apple.com" target="_blank" rel="noreferrer">Open App Store</a>
        </div>
      </div>

      <div className="card">
        <h3>In-App Feedback</h3>
        <div className="row">
          <label>Star rating</label>
          <div className="actions">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={n <= stars ? '' : 'secondary'} onClick={() => setStars(n)}>{n}★</button>
            ))}
          </div>
          <label>Comments</label>
          <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} />
          <label>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} /> Submit anonymously
          </label>
          <label>Feature Suggestion</label>
          <input placeholder="Optional" value={featureSuggestion} onChange={e => setFeatureSuggestion(e.target.value)} />
          <div className="actions">
            <button onClick={submit} disabled={stars === 0}>Submit</button>
          </div>
          {submitted && <div className="badge">Thanks for your feedback!</div>}
        </div>
      </div>
    </div>
  );
}

